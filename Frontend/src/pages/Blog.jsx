import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Badge } from '../components/ui';
import { Calendar, User, ArrowRight, Clock } from 'phosphor-react';

const Blog = () => {
  const articles = [
    {
      id: 1,
      slug: 'ai-ocr-revolutionizes-expense-management',
      title: 'How AI-Powered OCR is Revolutionizing Expense Management',
      excerpt: 'Discover how artificial intelligence and optical character recognition are transforming the way businesses handle expense reports, reducing processing time by up to 90%.',
      author: 'Sarah Johnson',
      date: '2024-03-15',
      readTime: '5 min read',
      category: 'Technology',
      featured: true
    },
    {
      id: 2,
      slug: 'multi-currency-approval-workflows',
      title: 'Building Effective Multi-Currency Approval Workflows',
      excerpt: 'Learn best practices for setting up approval workflows that handle multiple currencies seamlessly, ensuring compliance while maintaining efficiency.',
      author: 'Michael Chen',
      date: '2024-03-10',
      readTime: '7 min read',
      category: 'Best Practices',
      featured: false
    },
    {
      id: 3,
      slug: 'future-of-expense-management',
      title: 'The Future of Expense Management: Trends to Watch in 2024',
      excerpt: 'Explore emerging trends in expense management technology, from mobile-first solutions to predictive analytics and automated compliance checking.',
      author: 'Emily Rodriguez',
      date: '2024-03-05',
      readTime: '6 min read',
      category: 'Industry Insights',
      featured: false
    },
    {
      id: 4,
      slug: 'reducing-expense-fraud-with-ai',
      title: 'Reducing Expense Fraud with AI Detection Systems',
      excerpt: 'How machine learning algorithms can identify suspicious expense patterns and help companies reduce fraud while maintaining employee trust.',
      author: 'David Kim',
      date: '2024-02-28',
      readTime: '4 min read',
      category: 'Security',
      featured: false
    }
  ];

  const categories = [
    'All Posts',
    'Technology',
    'Best Practices',
    'Industry Insights',
    'Security'
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('All Posts');

  const filteredArticles = selectedCategory === 'All Posts' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const featuredArticle = articles.find(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'info',
      'Best Practices': 'success',
      'Industry Insights': 'warning',
      'Security': 'error'
    };
    return colors[category] || 'default';
  };

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="hero-text text-4xl sm:text-5xl lg:text-6xl font-light mb-6">
            ClaimDoo
            <span className="text-gradient bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              {' '}Blog
            </span>
          </h1>
          <p className="body-text text-xl max-w-3xl mx-auto">
            Insights, tips, and updates from the world of expense management and financial technology
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'glass-card text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Article */}
        {featuredArticle && selectedCategory === 'All Posts' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant={getCategoryColor(featuredArticle.category)}>
                      {featuredArticle.category}
                    </Badge>
                    <span className="text-primary-400 font-medium text-sm">Featured</span>
                  </div>
                  
                  <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-4 leading-tight">
                    {featuredArticle.title}
                  </h2>
                  
                  <p className="body-text mb-6 text-lg">
                    {featuredArticle.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        {featuredArticle.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        {formatDate(featuredArticle.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        {featuredArticle.readTime}
                      </div>
                    </div>
                    
                    <Link
                      to={`/blog/${featuredArticle.slug}`}
                      className="text-primary-400 hover:text-primary-300 font-medium flex items-center group transition-colors"
                    >
                      Read More
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-primary-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary-300 text-2xl font-bold">AI</span>
                    </div>
                    <p className="text-white/60">Featured Article</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Articles Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles
              .filter(article => selectedCategory === 'All Posts' ? !article.featured : true)
              .map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col">
                    <div className="flex-1">
                      <div className="mb-4">
                        <Badge variant={getCategoryColor(article.category)}>
                          {article.category}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="body-text text-sm mb-6 line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>
                    
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <User size={14} className="mr-1" />
                            {article.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(article.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {article.readTime}
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        to={`/blog/${article.slug}`}
                        className="text-primary-400 hover:text-primary-300 font-medium flex items-center group transition-colors text-sm"
                      >
                        Read More
                        <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <Card className="text-center p-12">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Stay Updated
            </h2>
            <p className="body-text text-lg mb-8 max-w-2xl mx-auto">
              Get the latest insights on expense management, financial technology, 
              and ClaimDoo updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="luxury-input flex-1"
              />
              <button className="neumorphic-btn glow-on-hover px-6 py-3 rounded-xl font-medium text-white whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;