'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Product, ProductReview, ReviewReply } from '@/types';
import { INITIAL_REVIEWS } from '@/data/mockData';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCart } from '@/context/CartContext';
import { OceanSelect } from '@/components/common/OceanSelect';
import {
  Star,
  ThumbsUp,
  Camera,
  CheckCircle2,
  Store,
  X,
  MessageSquare,
  Filter,
  Check,
  ShieldCheck,
  Send,
  Loader2,
  CornerDownRight,
  Sparkles,
  PenLine,
  RotateCcw,
} from 'lucide-react';

interface ProductReviewsSectionProps {
  product: Product;
}

const SAMPLE_UPLOAD_PHOTOS = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&auto=format&fit=crop&q=80',
];

const RATING_EMOTIONS: { [key: number]: { labelVi: string; labelEn: string; color: string } } = {
  1: { labelVi: 'Rất không hài lòng', labelEn: 'Very Dissatisfied', color: 'text-rose-500' },
  2: { labelVi: 'Không hài lòng', labelEn: 'Dissatisfied', color: 'text-amber-600' },
  3: { labelVi: 'Bình thường', labelEn: 'Neutral', color: 'text-amber-500' },
  4: { labelVi: 'Hài lòng', labelEn: 'Satisfied', color: 'text-emerald-600' },
  5: { labelVi: 'Cực kỳ hài lòng!', labelEn: 'Extremely Satisfied!', color: 'text-sky-600' },
};

const QUICK_TAGS_VI = [
  'Chất lượng tuyệt vời',
  'Đúng với mô tả',
  'Giao hàng siêu nhanh',
  'Đóng gói cẩn thận 2 lớp',
  'Đế êm tôn dáng',
  'Rất đáng tiền',
];

const QUICK_TAGS_EN = [
  'Great Quality',
  'Matches Description',
  'Super Fast Delivery',
  'Securely Packed',
  'Comfortable Fit',
  'Worth Every Penny',
];

export function ProductReviewsSection({ product }: ProductReviewsSectionProps) {
  const { language } = useLanguage();
  const { triggerToast, currentUser } = useCart();
  const composerRef = useRef<HTMLDivElement>(null);

  // Combine mock reviews for this product + fallback reviews
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const matched = INITIAL_REVIEWS.filter((r) => r.productId === product.id);
    if (matched.length > 0) return matched;
    // Fallback if this product doesn't have direct matches: clone initial reviews adapted for this product
    return INITIAL_REVIEWS.map((r, i) => ({
      ...r,
      id: `rev-fallback-${product.id}-${i}`,
      productId: product.id,
    }));
  });

  // Filter & Sort State
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all' | 'with_photo'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'helpful'>('newest');

  // INLINE WRITE REVIEW FORM STATE (Production In-Place Composer)
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isComposerExpanded, setIsComposerExpanded] = useState(true);

  // INLINE REPLY STATE (Trả Lời Bình Luận)
  const [activeReplyReviewId, setActiveReplyReviewId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [likedReplyIds, setLikedReplyIds] = useState<Set<string>>(new Set());

  // Lightbox State
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Liked reviews local tracker
  const [likedReviewIds, setLikedReviewIds] = useState<Set<string>>(new Set());

  // Star Breakdown calculation
  const totalReviewsCount = product.reviewCount || 1284;
  const ratingAverage = product.rating || 4.9;

  const starDistribution = useMemo(() => {
    return [
      { stars: 5, count: Math.round(totalReviewsCount * 0.88), percent: 88 },
      { stars: 4, count: Math.round(totalReviewsCount * 0.08), percent: 8 },
      { stars: 3, count: Math.round(totalReviewsCount * 0.025), percent: 2.5 },
      { stars: 2, count: Math.round(totalReviewsCount * 0.01), percent: 1 },
      { stars: 1, count: Math.round(totalReviewsCount * 0.005), percent: 0.5 },
    ];
  }, [totalReviewsCount]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    let list = [...reviews];
    if (selectedStarFilter === 'with_photo') {
      list = list.filter((r) => r.images && r.images.length > 0);
    } else if (typeof selectedStarFilter === 'number') {
      list = list.filter((r) => r.rating === selectedStarFilter);
    }

    if (sortBy === 'helpful') {
      list.sort((a, b) => b.likes - a.likes);
    } else {
      list.sort((a, b) => (b.id > a.id ? 1 : -1));
    }
    return list;
  }, [reviews, selectedStarFilter, sortBy]);

  // Handle Like/Helpful click for review
  const handleToggleLike = (reviewId: string) => {
    setLikedReviewIds((prev) => {
      const next = new Set(prev);
      const isCurrentlyLiked = next.has(reviewId);
      if (isCurrentlyLiked) {
        next.delete(reviewId);
        setReviews((rList) =>
          rList.map((r) => (r.id === reviewId ? { ...r, likes: Math.max(0, r.likes - 1) } : r))
        );
      } else {
        next.add(reviewId);
        setReviews((rList) =>
          rList.map((r) => (r.id === reviewId ? { ...r, likes: r.likes + 1 } : r))
        );
      }
      return next;
    });
  };

  // Handle Like/Helpful for a reply
  const handleToggleReplyLike = (reviewId: string, replyId: string) => {
    setLikedReplyIds((prev) => {
      const next = new Set(prev);
      const isLiked = next.has(replyId);
      if (isLiked) {
        next.delete(replyId);
      } else {
        next.add(replyId);
      }

      setReviews((rList) =>
        rList.map((r) => {
          if (r.id !== reviewId || !r.replies) return r;
          return {
            ...r,
            replies: r.replies.map((rep) =>
              rep.id === replyId
                ? { ...rep, likes: Math.max(0, (rep.likes || 0) + (isLiked ? -1 : 1)) }
                : rep
            ),
          };
        })
      );
      return next;
    });
  };

  // Toggle Tag in Review Form
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Select/Deselect sample photos
  const handleToggleSamplePhoto = (url: string) => {
    setUploadedPhotos((prev) =>
      prev.includes(url) ? prev.filter((p) => p !== url) : [...prev, url]
    );
  };

  // Reset Review Form
  const handleResetForm = () => {
    setNewComment('');
    setSelectedTags([]);
    setUploadedPhotos([]);
    setNewRating(5);
  };

  // Handle Submit New Review (In-Place / Inline)
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && selectedTags.length === 0) {
      triggerToast(
        language === 'vi'
          ? 'Vui lòng nhập nhận xét hoặc chọn tiêu chí đánh giá.'
          : 'Please enter a comment or select feedback tags.',
        'info'
      );
      return;
    }

    setIsSubmittingReview(true);
    setTimeout(() => {
      const authorName = isAnonymous
        ? (language === 'vi' ? 'Khách hàng ẩn danh' : 'Anonymous Buyer')
        : currentUser?.name || 'Khách hàng TerraSweep';

      const compiledContent = [
        selectedTags.length > 0 ? `[${selectedTags.join(', ')}]` : '',
        newComment.trim(),
      ]
        .filter(Boolean)
        .join(' - ');

      const newRev: ProductReview = {
        id: `rev-user-${Date.now()}`,
        productId: product.id,
        userName: authorName,
        rating: newRating,
        createdAt: language === 'vi' ? 'Vừa xong' : 'Just now',
        variantText: 'Tiêu chuẩn / Chính hãng',
        content: compiledContent || (language === 'vi' ? 'Sản phẩm rất tốt, đóng gói cẩn thận!' : 'Great product, securely packed!'),
        images: uploadedPhotos.length > 0 ? uploadedPhotos : undefined,
        likes: 0,
        isVerifiedPurchase: true,
        sellerResponse: {
          content:
            language === 'vi'
              ? `TerraSweep Flagship trân trọng cảm ơn bạn đã gửi đánh giá! Shop chúc bạn có trải nghiệm mua sắm thật tuyệt vời ạ!`
              : 'TerraSweep Flagship sincerely thanks you for your review! Have a wonderful shopping experience!',
          createdAt: language === 'vi' ? 'Vừa xong' : 'Just now',
        },
        replies: [],
      };

      setReviews((prev) => [newRev, ...prev]);
      setIsSubmittingReview(false);
      handleResetForm();

      triggerToast(
        language === 'vi'
          ? 'Đã đăng đánh giá thành công! Bình luận của bạn xuất hiện ngay phía dưới.'
          : 'Review published successfully! Your review appears below.',
        'success'
      );
    }, 450);
  };

  // Open Reply Box for a specific Review
  const handleOpenReplyBox = (reviewId: string, authorName: string) => {
    if (activeReplyReviewId === reviewId) {
      setActiveReplyReviewId(null);
      setReplyContent('');
    } else {
      setActiveReplyReviewId(reviewId);
      setReplyContent(`@${authorName} `);
    }
  };

  // Submit Reply to a Review
  const handleSubmitReply = (reviewId: string) => {
    if (!replyContent.trim() || isSubmittingReply) return;
    setIsSubmittingReply(true);

    setTimeout(() => {
      const newRep: ReviewReply = {
        id: `rep-${Date.now()}`,
        userName: currentUser?.name || (language === 'vi' ? 'Bạn' : 'You'),
        userAvatar: currentUser?.avatar,
        content: replyContent.trim(),
        createdAt: language === 'vi' ? 'Vừa xong' : 'Just now',
        likes: 0,
      };

      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, replies: [...(r.replies || []), newRep] }
            : r
        )
      );

      setIsSubmittingReply(false);
      setActiveReplyReviewId(null);
      setReplyContent('');

      triggerToast(
        language === 'vi' ? 'Đã gửi câu trả lời bình luận!' : 'Reply submitted successfully!',
        'success'
      );
    }, 350);
  };

  const quickTags = language === 'vi' ? QUICK_TAGS_VI : QUICK_TAGS_EN;

  return (
    <section className="mt-14 sm:mt-20 pt-10 border-t border-sky-100/80">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200/80">
              {language === 'vi' ? 'Cộng Đồng Người Mua' : 'Verified Reviews'}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? '100% Đã Mua Hàng' : '100% Real Purchases'}</span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>{language === 'vi' ? 'Đánh Giá & Nhận Xét Sản Phẩm' : 'Customer Ratings & Reviews'}</span>
            <span className="text-sm font-semibold text-slate-500 font-sans">
              ({totalReviewsCount.toLocaleString()} {language === 'vi' ? 'lượt' : 'total'})
            </span>
          </h2>
        </div>

        {/* Quick jump to inline composer button */}
        <button
          onClick={() => {
            composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const textarea = document.getElementById('inline-review-textarea');
            if (textarea) textarea.focus();
          }}
          className="btn-ocean-primary px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer hover:shadow-md transition-all active:scale-95"
        >
          <PenLine className="w-4 h-4" />
          <span>{language === 'vi' ? 'Viết Đánh Giá Của Bạn' : 'Write a Review'}</span>
        </button>
      </div>

      {/* RATING BREAKDOWN CARD */}
      <div className="rounded-3xl bg-white border border-sky-100/90 shadow-xs p-6 sm:p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
          {/* Big Score Summary (Left Column) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center md:border-r border-sky-100/80 md:pr-8">
            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl sm:text-6xl font-black text-slate-900 font-sans tracking-tight">
                {ratingAverage.toFixed(1)}
              </span>
              <span className="text-xl font-bold text-slate-400 font-sans">/ 5</span>
            </div>

            {/* Glowing Amber Stars */}
            <div className="flex items-center gap-1 my-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-xs"
                />
              ))}
            </div>

            <p className="text-xs font-semibold text-slate-600">
              {language === 'vi'
                ? `Dựa trên ${totalReviewsCount.toLocaleString()} đánh giá được chứng thực`
                : `Based on ${totalReviewsCount.toLocaleString()} verified buyers`}
            </p>

            <div className="mt-3 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-bold text-emerald-700">
              {language === 'vi' ? '✨ 98% khách hàng hài lòng' : '✨ 98% satisfaction rate'}
            </div>
          </div>

          {/* Star Distribution Progress Bars (Right Column) */}
          <div className="md:col-span-8 space-y-2.5">
            {starDistribution.map((row) => (
              <div
                key={row.stars}
                onClick={() => setSelectedStarFilter(selectedStarFilter === row.stars ? 'all' : row.stars)}
                className={`flex items-center gap-3 text-xs cursor-pointer p-1 rounded-xl transition-colors ${
                  selectedStarFilter === row.stars ? 'bg-sky-50/70' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1 w-14 shrink-0 font-bold text-slate-700">
                  <span>{row.stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>

                {/* Progress Bar */}
                <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${row.percent}%`,
                      background:
                        row.stars >= 4
                          ? 'linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%)'
                          : row.stars === 3
                          ? '#f59e0b'
                          : '#f43f5e',
                    }}
                  />
                </div>

                <div className="w-20 shrink-0 text-right font-mono font-medium text-slate-500 tabular-nums">
                  {row.count.toLocaleString()} ({row.percent}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER & SORT TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none flex-wrap">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            {language === 'vi' ? 'Lọc:' : 'Filter:'}
          </span>

          {/* All */}
          <button
            onClick={() => setSelectedStarFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedStarFilter === 'all'
                ? 'btn-ocean-primary text-white shadow-xs'
                : 'bg-white border border-sky-100 text-slate-700 hover:border-sky-300'
            }`}
          >
            {language === 'vi' ? 'Tất Cả' : 'All'} ({totalReviewsCount.toLocaleString()})
          </button>

          {/* With Photos */}
          <button
            onClick={() => setSelectedStarFilter(selectedStarFilter === 'with_photo' ? 'all' : 'with_photo')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedStarFilter === 'with_photo'
                ? 'btn-ocean-primary text-white shadow-xs'
                : 'bg-white border border-sky-100 text-slate-700 hover:border-sky-300'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Có Hình Ảnh' : 'With Photos'} (438)</span>
          </button>

          {/* Star Buttons */}
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStarFilter(selectedStarFilter === s ? 'all' : s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                selectedStarFilter === s
                  ? 'btn-ocean-primary text-white shadow-xs'
                  : 'bg-white border border-sky-100 text-slate-700 hover:border-sky-300'
              }`}
            >
              <span>{s}</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-slate-500 font-medium">
            {language === 'vi' ? 'Sắp xếp:' : 'Sort by:'}
          </span>
          <OceanSelect
            value={sortBy}
            onChange={(val) => setSortBy(val as any)}
            options={[
              { value: 'newest', label: language === 'vi' ? 'Mới nhất' : 'Newest' },
              { value: 'helpful', label: language === 'vi' ? 'Hữu ích nhất' : 'Most Helpful' },
            ]}
            variant="pill"
            size="sm"
            align="right"
            className="bg-white border-sky-100"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. INLINE REVIEW COMPOSER CARD (PRODUCTION STANDARD - NẰM TRÊN CÙNG)      */}
      {/* ========================================================================= */}
      <div
        ref={composerRef}
        id="write-review-form"
        className="rounded-3xl bg-white border border-sky-200/90 shadow-sm p-5 sm:p-7 mb-6 relative overflow-hidden transition-all"
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-sky-100">
          <div className="flex items-center gap-3">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-sky-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-700 text-white font-bold text-sm flex items-center justify-center shadow-2xs">
                {currentUser?.name?.charAt(0) || 'B'}
              </div>
            )}
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>{language === 'vi' ? 'Viết Đánh Giá & Chia Sẻ Trải Nghiệm Của Bạn' : 'Write a Product Review'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 hidden sm:inline-block">
                  TerraVerified
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'vi' ? 'Bình luận của bạn sẽ xuất hiện ngay lập tức ở đầu danh sách' : 'Your review will be posted directly to the top'}
              </p>
            </div>
          </div>

          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
            {product.name.slice(0, 30)}...
          </span>
        </div>

        <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
          {/* Rating Stars Picker Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-700">
                {language === 'vi' ? 'Chất lượng sản phẩm:' : 'Rating:'}
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const currentRating = hoverRating || newRating;
                  const isFilled = star <= currentRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setNewRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                            : 'text-slate-200 hover:text-amber-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <span className={`text-xs font-bold ${RATING_EMOTIONS[hoverRating || newRating].color}`}>
              {language === 'vi'
                ? RATING_EMOTIONS[hoverRating || newRating].labelVi
                : RATING_EMOTIONS[hoverRating || newRating].labelEn}
            </span>
          </div>

          {/* Quick Tags Selection Pills */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              {language === 'vi' ? 'Tiêu chí đánh giá nổi bật (chọn nhanh):' : 'Key Highlights:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {quickTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 border-sky-500 text-white shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Textarea */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {language === 'vi' ? 'Nhận xét chi tiết của bạn:' : 'Detailed Review:'}
            </label>
            <textarea
              id="inline-review-textarea"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                language === 'vi'
                  ? 'Hãy chia sẻ cảm nhận về kích cỡ, chất liệu thực tế, sự thoải mái và thời gian giao hàng...'
                  : 'Share your thoughts on fit, fabric, comfort, and unboxing...'
              }
              className="w-full px-4 py-3 rounded-2xl bg-slate-50/70 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 focus:bg-white resize-none transition-colors"
            />
            <div className="flex justify-between items-center text-[10.5px] text-slate-400 mt-1">
              <span>{language === 'vi' ? 'Tối thiểu 15 ký tự để nhận xét có giá trị hơn' : 'Help other shoppers with details'}</span>
              <span>{newComment.length} / 500</span>
            </div>
          </div>

          {/* Sample Unbox Photos Attachment */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {language === 'vi' ? 'Đính kèm hình ảnh unbox thực tế:' : 'Attach Real Photos:'}
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {SAMPLE_UPLOAD_PHOTOS.map((photo, pIdx) => {
                const isChosen = uploadedPhotos.includes(photo);
                return (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleToggleSamplePhoto(photo)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 relative cursor-pointer transition-all ${
                      isChosen
                        ? 'border-sky-500 ring-2 ring-sky-300 scale-105'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="Sample unbox" className="w-full h-full object-cover" />
                    {isChosen && (
                      <div className="absolute inset-0 bg-sky-600/40 flex items-center justify-center text-white">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[10.5px] text-slate-400 mt-1">
              {language === 'vi' ? 'Nhấp chọn ảnh chụp thực tế để minh họa sinh động cho đánh giá' : 'Select sample unbox photos to attach'}
            </p>
          </div>

          {/* Action Row: Anonymous Checkbox + Submit Button */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer accent-sky-600"
              />
              <span className="text-xs text-slate-600 font-medium">
                {language === 'vi' ? 'Đăng ẩn danh (Che tên thật của bạn)' : 'Post anonymously'}
              </span>
            </label>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              {(newComment.trim() || selectedTags.length > 0 || uploadedPhotos.length > 0) && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3.5 py-2 rounded-full text-slate-500 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Làm Mới' : 'Reset'}</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="btn-ocean-primary px-7 py-2.5 rounded-full text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 active:scale-95 transition-all"
              >
                {isSubmittingReview ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'vi' ? 'Đang đăng...' : 'Posting...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'vi' ? 'Đăng Bình Luận' : 'Post Review'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 2. REVIEWS & THREADED COMMENTS LIST                                       */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-sky-100 text-center space-y-3">
            <p className="text-slate-500 text-sm">
              {language === 'vi'
                ? 'Không tìm thấy đánh giá phù hợp với bộ lọc.'
                : 'No reviews found matching the selected filter.'}
            </p>
            <button
              onClick={() => setSelectedStarFilter('all')}
              className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
            >
              {language === 'vi' ? 'Xóa bộ lọc' : 'Clear filter'}
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const isLiked = likedReviewIds.has(rev.id);
            const isReplyingThis = activeReplyReviewId === rev.id;
            const replyCount = rev.replies?.length || 0;

            return (
              <div
                key={rev.id}
                className="rounded-3xl bg-white border border-sky-100/90 shadow-2xs p-5 sm:p-6 transition-all hover:border-sky-200"
              >
                {/* Reviewer Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    {rev.userAvatar ? (
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="w-10 h-10 rounded-full object-cover border border-sky-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-700 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                        {rev.userName.charAt(0)}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {rev.userName}
                        </span>
                        {rev.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {language === 'vi' ? 'Đã mua hàng' : 'Verified Buyer'}
                          </span>
                        )}
                      </div>

                      {/* Stars & Variant Info */}
                      <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-slate-500">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span>•</span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {rev.createdAt}
                        </span>
                        {rev.variantText && (
                          <>
                            <span>•</span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                              {rev.variantText}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Text Content */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans mt-2">
                  {rev.content}
                </p>

                {/* Customer Attached Photos (Gallery with Lightbox trigger) */}
                {rev.images && rev.images.length > 0 && (
                  <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
                    {rev.images.map((imgUrl, imgIdx) => (
                      <button
                        key={imgIdx}
                        onClick={() => setLightboxImage(imgUrl)}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 hover:border-sky-400 hover:scale-105 transition-all cursor-pointer relative group"
                        title={language === 'vi' ? 'Nhấn để phóng to ảnh' : 'Click to zoom'}
                      >
                        <img
                          src={imgUrl}
                          alt="Customer review visual"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-sky-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Camera className="w-4 h-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Official Merchant Response */}
                {rev.sellerResponse && (
                  <div className="mt-4 p-4 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Store className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{language === 'vi' ? 'Phản Hồi Của Người Bán' : 'Seller Response'}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-100 text-sky-800">
                            TerraSweep Official
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {rev.sellerResponse.createdAt}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-sans">
                        {rev.sellerResponse.content}
                      </p>
                    </div>
                  </div>
                )}

                {/* ============================================================= */}
                {/* THREADED REPLIES SECTION (CÁC CÂU TRẢ LỜI CHO BÌNH LUẬN NÀY)  */}
                {/* ============================================================= */}
                {rev.replies && rev.replies.length > 0 && (
                  <div className="mt-3.5 pl-3 sm:pl-5 border-l-2 border-sky-100 space-y-3">
                    <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{language === 'vi' ? `Câu trả lời (${rev.replies.length}):` : `Replies (${rev.replies.length}):`}</span>
                    </div>

                    {rev.replies.map((rep) => {
                      const isReplyLiked = likedReplyIds.has(rep.id);
                      return (
                        <div
                          key={rep.id}
                          className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 text-xs space-y-1.5 transition-all hover:bg-slate-50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {rep.userAvatar ? (
                                <img
                                  src={rep.userAvatar}
                                  alt={rep.userName}
                                  className="w-6 h-6 rounded-full object-cover border border-sky-100"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold text-[10px] flex items-center justify-center">
                                  {rep.userName.charAt(0)}
                                </div>
                              )}
                              <span className="font-bold text-slate-800">{rep.userName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{rep.createdAt}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleReplyLike(rev.id, rep.id)}
                              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                                isReplyLiked
                                  ? 'text-sky-600 bg-sky-50 font-bold'
                                  : 'text-slate-500 hover:text-sky-600'
                              }`}
                            >
                              <ThumbsUp className={`w-3 h-3 ${isReplyLiked ? 'fill-sky-600 text-sky-600' : ''}`} />
                              <span>{rep.likes || 0}</span>
                            </button>
                          </div>

                          <p className="text-slate-700 leading-relaxed font-sans pl-8">
                            {rep.content}
                          </p>

                          {/* Quick reply mention trigger */}
                          <div className="pl-8 pt-0.5">
                            <button
                              type="button"
                              onClick={() => handleOpenReplyBox(rev.id, rep.userName)}
                              className="text-[10.5px] font-semibold text-sky-600 hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <CornerDownRight className="w-3 h-3" />
                              <span>{language === 'vi' ? 'Trả lời' : 'Reply'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* INLINE REPLY INPUT FORM (KHI BẤM "TRẢ LỜI") */}
                {isReplyingThis && (
                  <div className="mt-3.5 p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <span className="font-bold text-sky-800 flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'vi' ? 'Viết câu trả lời bình luận:' : 'Reply to comment:'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveReplyReviewId(null)}
                        className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-start gap-2.5">
                      {currentUser?.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt="avatar"
                          className="w-7 h-7 rounded-full object-cover shrink-0 mt-1"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                          {currentUser?.name?.charAt(0) || 'B'}
                        </div>
                      )}

                      <div className="flex-1 space-y-2">
                        <textarea
                          rows={2}
                          autoFocus
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={
                            language === 'vi'
                              ? `Nhập câu trả lời của bạn...`
                              : `Write your reply...`
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 resize-none shadow-2xs"
                        />

                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveReplyReviewId(null)}
                            className="px-3 py-1 rounded-full text-slate-500 hover:bg-slate-200/60 text-xs font-semibold cursor-pointer"
                          >
                            {language === 'vi' ? 'Hủy' : 'Cancel'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSubmitReply(rev.id)}
                            disabled={!replyContent.trim() || isSubmittingReply}
                            className="btn-ocean-primary px-4 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                          >
                            {isSubmittingReply ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3 h-3" />
                            )}
                            <span>{language === 'vi' ? 'Gửi Trả Lời' : 'Post Reply'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Interactions (Helpful Vote + Reply Trigger Button) */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    {/* Like / Helpful Button */}
                    <button
                      onClick={() => handleToggleLike(rev.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-sky-600 text-sky-600' : ''}`} />
                      <span>
                        {language === 'vi' ? 'Hữu ích' : 'Helpful'} ({rev.likes})
                      </span>
                    </button>

                    {/* Reply Trigger Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenReplyBox(rev.id, rev.userName)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer font-semibold ${
                        isReplyingThis
                          ? 'bg-sky-100 text-sky-800'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'vi' ? 'Trả lời' : 'Reply'}</span>
                      {replyCount > 0 && (
                        <span className="font-bold text-sky-700 ml-0.5">({replyCount})</span>
                      )}
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 cursor-pointer hover:underline">
                    {language === 'vi' ? 'Báo cáo' : 'Report'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* PHOTO LIGHTBOX MODAL (Full Resolution Image Viewer)                       */}
      {/* ========================================================================= */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-2 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition-colors cursor-pointer z-10"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full aspect-square sm:aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src={lightboxImage}
                alt="Enlarged customer photo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-3 text-center text-xs text-slate-500 font-medium">
              {language === 'vi' ? 'Ảnh chụp thực tế từ khách hàng đã mua sản phẩm' : 'Real buyer unbox photograph'}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
