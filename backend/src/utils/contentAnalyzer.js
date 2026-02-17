/**
 * Analyze extracted text and generate engagement scores + suggestions
 */

const analyzeContent = (text) => {
  const hashtags = extractHashtags(text);
  const mentions = extractMentions(text);
  const emojis = extractEmojis(text);
  const wordCount = countWords(text);
  const charCount = text.length;
  const sentiment = analyzeSentiment(text);
  const platform = detectPlatform(text, hashtags);
  const engagementScore = calculateEngagementScore(text, hashtags, mentions, emojis, wordCount, sentiment);
  const suggestions = generateSuggestions(text, hashtags, mentions, emojis, wordCount, engagementScore, platform);

  return {
    wordCount,
    charCount,
    hashtags,
    mentions,
    emojis,
    sentiment,
    platform,
    engagementScore,
    suggestions
  };
};

const extractHashtags = (text) => {
  const matches = text.match(/#[a-zA-Z0-9_]+/g) || [];
  return [...new Set(matches)];
};

const extractMentions = (text) => {
  const matches = text.match(/@[a-zA-Z0-9_.]+/g) || [];
  return [...new Set(matches)];
};

const extractEmojis = (text) => {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const matches = text.match(emojiRegex) || [];
  return [...new Set(matches)];
};

const countWords = (text) => {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
};

const analyzeSentiment = (text) => {
  const positiveWords = ['great', 'amazing', 'awesome', 'love', 'excellent', 'fantastic', 'wonderful', 'best', 'happy', 'excited', 'thrilled', 'perfect', 'brilliant', 'outstanding', 'incredible', 'superb', 'good', 'joy', 'beautiful', 'win', 'success', 'celebrate'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'disappointing', 'sad', 'angry', 'frustrated', 'fail', 'problem', 'issue', 'error', 'wrong', 'poor', 'weak'];

  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

const detectPlatform = (text, hashtags) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('instagram') || lowerText.includes('reels') || lowerText.includes('igtv')) return 'instagram';
  if (lowerText.includes('twitter') || lowerText.includes('tweet') || lowerText.includes('retweet')) return 'twitter';
  if (lowerText.includes('linkedin') || lowerText.includes('professional') || lowerText.includes('career')) return 'linkedin';
  if (lowerText.includes('facebook') || lowerText.includes('fb')) return 'facebook';
  return 'general';
};

const calculateEngagementScore = (text, hashtags, mentions, emojis, wordCount, sentiment) => {
  // Readability score (ideal: 50-150 words)
  let readability = 0;
  if (wordCount >= 30 && wordCount <= 150) readability = 90;
  else if (wordCount < 30) readability = Math.min(90, (wordCount / 30) * 90);
  else readability = Math.max(40, 90 - ((wordCount - 150) / 10) * 5);

  // Hashtag score (ideal: 3-10 hashtags)
  let hashtagScore = 0;
  if (hashtags.length === 0) hashtagScore = 20;
  else if (hashtags.length >= 3 && hashtags.length <= 10) hashtagScore = 95;
  else if (hashtags.length < 3) hashtagScore = 60;
  else hashtagScore = Math.max(40, 95 - (hashtags.length - 10) * 5);

  // CTA score
  const ctaKeywords = ['click', 'link', 'bio', 'follow', 'share', 'comment', 'tag', 'like', 'subscribe', 'join', 'visit', 'check', 'discover', 'learn', 'save', 'dm', 'contact', 'buy', 'get'];
  const lowerText = text.toLowerCase();
  const ctaCount = ctaKeywords.filter(k => lowerText.includes(k)).length;
  const callToAction = Math.min(100, ctaCount * 25);

  // Sentiment score
  const sentimentScore = sentiment === 'positive' ? 85 : sentiment === 'neutral' ? 65 : 40;

  // Length score (chars)
  const charCount = text.length;
  let lengthScore = 0;
  if (charCount >= 100 && charCount <= 500) lengthScore = 90;
  else if (charCount < 100) lengthScore = Math.min(90, (charCount / 100) * 90);
  else lengthScore = Math.max(50, 90 - ((charCount - 500) / 100) * 5);

  // Overall
  const overall = Math.round(
    (readability * 0.25) +
    (hashtagScore * 0.2) +
    (callToAction * 0.25) +
    (sentimentScore * 0.15) +
    (lengthScore * 0.15)
  );

  return {
    overall: Math.min(100, overall),
    readability: Math.round(readability),
    hashtags: Math.round(hashtagScore),
    callToAction: Math.round(callToAction),
    sentiment: Math.round(sentimentScore),
    length: Math.round(lengthScore)
  };
};

const generateSuggestions = (text, hashtags, mentions, emojis, wordCount, scores, platform) => {
  const suggestions = [];
  const lowerText = text.toLowerCase();

  // Hashtag suggestions
  if (hashtags.length === 0) {
    suggestions.push({
      category: 'Hashtags',
      suggestion: 'Add 5-10 relevant hashtags to increase discoverability. Research trending hashtags in your niche.',
      priority: 'high'
    });
  } else if (hashtags.length < 3) {
    suggestions.push({
      category: 'Hashtags',
      suggestion: `You have only ${hashtags.length} hashtag(s). Add at least 5 more to boost reach and discoverability.`,
      priority: 'high'
    });
  } else if (hashtags.length > 15) {
    suggestions.push({
      category: 'Hashtags',
      suggestion: 'Too many hashtags can look spammy. Reduce to 5-10 highly relevant hashtags for better engagement.',
      priority: 'medium'
    });
  }

  // CTA suggestions
  const ctaKeywords = ['click', 'link', 'bio', 'follow', 'share', 'comment', 'tag', 'like', 'subscribe'];
  const hasCTA = ctaKeywords.some(k => lowerText.includes(k));
  if (!hasCTA) {
    suggestions.push({
      category: 'Call to Action',
      suggestion: 'Add a clear call-to-action like "Drop a comment below", "Share with a friend", or "Click the link in bio" to drive engagement.',
      priority: 'high'
    });
  }

  // Emoji suggestions
  if (emojis.length === 0) {
    suggestions.push({
      category: 'Visual Appeal',
      suggestion: 'Add 2-5 relevant emojis to make your post more visually appealing and increase engagement by up to 25%.',
      priority: 'medium'
    });
  }

  // Word count suggestions
  if (wordCount < 20) {
    suggestions.push({
      category: 'Content Length',
      suggestion: 'Your post is very short. Add more context or storytelling to connect better with your audience.',
      priority: 'medium'
    });
  } else if (wordCount > 200) {
    suggestions.push({
      category: 'Content Length',
      suggestion: 'Long posts can lose reader attention. Consider breaking it into a carousel or thread for better engagement.',
      priority: 'medium'
    });
  }

  // Question suggestion
  const hasQuestion = text.includes('?');
  if (!hasQuestion) {
    suggestions.push({
      category: 'Engagement Boost',
      suggestion: 'Ask a question to encourage comments. Posts with questions get 100% more comments than those without.',
      priority: 'high'
    });
  }

  // Mentions
  if (mentions.length === 0) {
    suggestions.push({
      category: 'Reach',
      suggestion: 'Tag relevant accounts or collaborators to expand your reach and encourage them to share your post.',
      priority: 'low'
    });
  }

  // Platform-specific
  if (platform === 'instagram') {
    suggestions.push({
      category: 'Instagram Tips',
      suggestion: 'Use the first line as a hook — it\'s what shows before "more". Make it attention-grabbing!',
      priority: 'high'
    });
  } else if (platform === 'linkedin') {
    suggestions.push({
      category: 'LinkedIn Tips',
      suggestion: 'Start with a bold statement or personal story. LinkedIn rewards authenticity and professional insights.',
      priority: 'medium'
    });
  } else if (platform === 'twitter') {
    suggestions.push({
      category: 'Twitter Tips',
      suggestion: 'Keep it under 240 characters for maximum impact. Use a thread for longer content.',
      priority: 'medium'
    });
  }

  // General best practice
  suggestions.push({
    category: 'Best Practice',
    suggestion: 'Post consistently at peak times (typically 9-11 AM and 6-8 PM in your audience\'s timezone) for maximum visibility.',
    priority: 'low'
  });

  return suggestions;
};

module.exports = { analyzeContent };
