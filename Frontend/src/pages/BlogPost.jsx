import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Badge } from '../components/ui';
import { Calendar, User, Clock, ArrowLeft, Share, BookmarkSimple, Heart } from 'phosphor-react';

const BlogPost = () => {
  const { slug } = useParams();

  // Mock blog posts data - in a real app, this would come from an API
  const posts = {
    'ai-ocr-revolutionizes-expense-management': {
      id: 1,
      title: 'How AI-Powered OCR is Revolutionizing Expense Management',
      excerpt: 'Discover how artificial intelligence and optical character recognition are transforming the way businesses handle expense reports, reducing processing time by up to 90%.',
      author: 'Sarah Johnson',
      date: '2024-03-15',
      readTime: '5 min read',
      category: 'Technology',
      featured: true,
      content: `
        <h2>The Traditional Expense Management Challenge</h2>
        <p>For decades, businesses have struggled with the time-consuming and error-prone process of expense management. Employees would collect paper receipts, manually enter data into spreadsheets or forms, and submit them for approval. Finance teams would then spend countless hours reviewing, validating, and processing these expenses.</p>
        
        <p>This traditional approach led to several issues:</p>
        <ul>
          <li>High processing costs and administrative overhead</li>
          <li>Frequent errors in data entry and categorization</li>
          <li>Delayed reimbursements affecting employee satisfaction</li>
          <li>Difficulty in tracking and analyzing expense patterns</li>
          <li>Compliance challenges with tax regulations</li>
        </ul>
        
        <h2>Enter AI-Powered OCR Technology</h2>
        <p>Optical Character Recognition (OCR) technology has been around for years, but recent advances in artificial intelligence have transformed it into a powerful tool for expense management. Modern AI-powered OCR systems can:</p>
        
        <blockquote>
          "Extract not just text, but understand context, categorize expenses automatically, and even detect potential fraud patterns."
        </blockquote>
        
        <h3>Key Capabilities of Modern OCR Systems</h3>
        <p><strong>Intelligent Data Extraction:</strong> Modern OCR doesn't just read text; it understands the structure of receipts, invoices, and other financial documents. It can identify key fields like merchant name, date, amount, tax information, and expense categories.</p>
        
        <p><strong>Multi-Language Support:</strong> Global businesses benefit from OCR systems that can process documents in multiple languages and currencies, automatically converting and standardizing the data.</p>
        
        <p><strong>Mobile Integration:</strong> Employees can simply photograph receipts with their smartphones, and the OCR system processes them instantly, eliminating the need to save and organize paper receipts.</p>
        
        <h2>The Impact on Business Operations</h2>
        <p>Companies implementing AI-powered OCR for expense management report significant improvements:</p>
        
        <ul>
          <li><strong>90% reduction in processing time:</strong> What once took hours now takes minutes</li>
          <li><strong>95% accuracy rate:</strong> AI systems achieve higher accuracy than manual data entry</li>
          <li><strong>50% cost reduction:</strong> Lower administrative costs and faster processing</li>
          <li><strong>Real-time visibility:</strong> Instant expense tracking and reporting</li>
        </ul>
        
        <h2>Looking Ahead: The Future of Expense Management</h2>
        <p>As AI technology continues to evolve, we can expect even more sophisticated features:</p>
        
        <p><strong>Predictive Analytics:</strong> AI will help predict spending patterns and identify budget overruns before they happen.</p>
        
        <p><strong>Smart Categorization:</strong> Machine learning will improve expense categorization based on company-specific rules and historical data.</p>
        
        <p><strong>Fraud Detection:</strong> Advanced algorithms will identify suspicious patterns and potential fraudulent expenses in real-time.</p>
        
        <h2>Conclusion</h2>
        <p>AI-powered OCR is not just improving expense management; it's revolutionizing it. By automating data extraction, improving accuracy, and providing real-time insights, this technology is enabling businesses to focus on strategic activities rather than administrative tasks.</p>
        
        <p>The question is no longer whether to adopt AI-powered expense management, but how quickly organizations can implement these solutions to stay competitive in today's fast-paced business environment.</p>
      `
    },
    'multi-currency-approval-workflows': {
      id: 2,
      title: 'Building Effective Multi-Currency Approval Workflows',
      excerpt: 'Learn best practices for setting up approval workflows that handle multiple currencies seamlessly, ensuring compliance while maintaining efficiency.',
      author: 'Michael Chen',
      date: '2024-03-10',
      readTime: '7 min read',
      category: 'Best Practices',
      featured: false,
      content: `
        <h2>The Multi-Currency Challenge</h2>
        <p>As businesses expand globally, managing expenses across multiple currencies becomes increasingly complex. Different exchange rates, varying approval thresholds, and compliance requirements across regions create unique challenges for expense management systems.</p>
        
        <h2>Setting Up Currency-Aware Approval Rules</h2>
        <p>Effective multi-currency approval workflows require careful consideration of several factors:</p>
        
        <h3>1. Dynamic Threshold Management</h3>
        <p>Instead of fixed amounts, use percentage-based thresholds or equivalent amounts in base currency. This ensures consistent approval levels regardless of the transaction currency.</p>
        
        <h3>2. Real-Time Exchange Rates</h3>
        <p>Implement systems that use current exchange rates for approval decisions, while maintaining historical rates for audit trails.</p>
        
        <h2>Best Practices for Implementation</h2>
        <ul>
          <li>Establish clear base currency standards</li>
          <li>Define region-specific approval hierarchies</li>
          <li>Implement automated currency conversion</li>
          <li>Maintain compliance with local regulations</li>
        </ul>
        
        <p>Multi-currency workflows require careful planning but provide significant benefits for global organizations seeking efficient expense management.</p>
      `
    },
    'future-of-expense-management': {
      id: 3,
      title: 'The Future of Expense Management: Trends to Watch in 2024',
      excerpt: 'Explore emerging trends in expense management technology, from mobile-first solutions to predictive analytics and automated compliance checking.',
      author: 'Emily Rodriguez',
      date: '2024-03-05',
      readTime: '6 min read',
      category: 'Industry Insights',
      featured: false,
      content: `
        <h2>The Evolution of Expense Management</h2>
        <p>The expense management landscape is rapidly evolving, driven by technological advances and changing workplace dynamics. Here are the key trends shaping the future:</p>
        
        <h2>1. Mobile-First Experiences</h2>
        <p>With remote work becoming the norm, mobile-first expense management solutions are no longer optional. Employees expect to capture, submit, and approve expenses directly from their smartphones.</p>
        
        <h2>2. Artificial Intelligence Integration</h2>
        <p>AI is transforming every aspect of expense management:</p>
        <ul>
          <li>Intelligent receipt processing</li>
          <li>Automated expense categorization</li>
          <li>Fraud detection and prevention</li>
          <li>Predictive spending analytics</li>
        </ul>
        
        <h2>3. Real-Time Processing</h2>
        <p>The future belongs to systems that process expenses in real-time, providing instant feedback and approvals rather than batch processing.</p>
        
        <h2>Preparing for the Future</h2>
        <p>Organizations should focus on scalable, flexible solutions that can adapt to changing business needs and technological advances.</p>
      `
    },
    'reducing-expense-fraud-with-ai': {
      id: 4,
      title: 'Reducing Expense Fraud with AI Detection Systems',
      excerpt: 'How machine learning algorithms can identify suspicious expense patterns and help companies reduce fraud while maintaining employee trust.',
      author: 'David Kim',
      date: '2024-02-28',
      readTime: '4 min read',
      category: 'Security',
      featured: false,
      content: `
        <h2>The Hidden Cost of Expense Fraud</h2>
        <p>Expense fraud costs businesses billions of dollars annually. Traditional detection methods often miss sophisticated fraud schemes while creating friction for honest employees.</p>
        
        <h2>How AI Detects Fraud</h2>
        <p>Machine learning algorithms analyze patterns across multiple dimensions:</p>
        
        <h3>Behavioral Analysis</h3>
        <p>AI systems learn normal spending patterns for each employee and flag unusual behavior that might indicate fraud.</p>
        
        <h3>Document Verification</h3>
        <p>Advanced OCR and image analysis can detect altered receipts, duplicate submissions, and suspicious document patterns.</p>
        
        <h2>Balancing Security and Trust</h2>
        <p>Effective fraud detection systems must balance security with employee experience. The best systems work invisibly, flagging genuine concerns while allowing legitimate expenses to flow smoothly.</p>
        
        <h2>Implementation Strategy</h2>
        <p>Successful AI fraud detection requires:</p>
        <ul>
          <li>Clear policies and communication</li>
          <li>Gradual implementation with feedback loops</li>
          <li>Regular model training and updates</li>
          <li>Human oversight for complex cases</li>
        </ul>
        
        <p>By implementing AI-powered fraud detection, organizations can significantly reduce losses while maintaining a positive employee experience.</p>
      `
    }
  };

  const post = posts[slug];

  if (!post) {
    return (
      <div className="min-h-screen px-4 py-16 flex items-center justify-center">
        <Card className="text-center p-12">
          <h1 className="text-2xl font-semibold text-white mb-4">Post Not Found</h1>
          <p className="body-text mb-6">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="neumorphic-btn glow-on-hover px-6 py-3 rounded-xl font-medium text-white inline-flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>
        </Card>
      </div>
    );
  }

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
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            className="text-primary-400 hover:text-primary-300 font-medium flex items-center group transition-colors"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Card className="p-8 lg:p-12">
            <div className="mb-6">
              <Badge variant={getCategoryColor(post.category)} className="mb-4">
                {post.category}
              </Badge>
              
              <h1 className="text-3xl lg:text-4xl font-semibold text-white mb-6 leading-tight">
                {post.title}
              </h1>
              
              <p className="body-text text-lg mb-8">
                {post.excerpt}
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-center space-x-6 text-sm text-white/60">
                  <div className="flex items-center">
                    <User size={16} className="mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    {formatDate(post.date)}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    {post.readTime}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="text-white/60 hover:text-primary-400 transition-colors">
                    <Share size={20} />
                  </button>
                  <button className="text-white/60 hover:text-primary-400 transition-colors">
                    <BookmarkSimple size={20} />
                  </button>
                  <button className="text-white/60 hover:text-red-400 transition-colors">
                    <Heart size={20} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="p-8 lg:p-12">
            <div 
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                '--tw-prose-body': '#e2e8f0',
                '--tw-prose-headings': '#ffffff',
                '--tw-prose-lead': '#cbd5e1',
                '--tw-prose-links': '#60a5fa',
                '--tw-prose-bold': '#ffffff',
                '--tw-prose-counters': '#94a3b8',
                '--tw-prose-bullets': '#64748b',
                '--tw-prose-hr': '#334155',
                '--tw-prose-quotes': '#f1f5f9',
                '--tw-prose-quote-borders': '#334155',
                '--tw-prose-captions': '#94a3b8',
                '--tw-prose-code': '#f8fafc',
                '--tw-prose-pre-code': '#e2e8f0',
                '--tw-prose-pre-bg': '#1e293b',
                '--tw-prose-th-borders': '#334155',
                '--tw-prose-td-borders': '#334155'
              }}
            />
          </Card>
        </motion.div>

        {/* Author Bio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="p-8">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{post.author}</h3>
                <p className="body-text text-sm">
                  {post.author === 'Sarah Johnson' && 'Sarah is a technology writer and AI specialist with over 8 years of experience in fintech. She focuses on emerging technologies that transform business operations.'}
                  {post.author === 'Michael Chen' && 'Michael is a financial operations consultant who helps global companies optimize their expense management processes. He has worked with Fortune 500 companies across 20+ countries.'}
                  {post.author === 'Emily Rodriguez' && 'Emily is an industry analyst specializing in expense management trends and digital transformation. She regularly speaks at fintech conferences worldwide.'}
                  {post.author === 'David Kim' && 'David is a cybersecurity expert focused on financial fraud prevention. He has developed AI-powered security solutions for leading expense management platforms.'}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Related Articles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-semibold text-white mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(posts)
              .filter(([key]) => key !== slug)
              .slice(0, 2)
              .map(([key, relatedPost]) => (
                <Card key={key} className="p-6">
                  <Badge variant={getCategoryColor(relatedPost.category)} className="mb-3">
                    {relatedPost.category}
                  </Badge>
                  <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="body-text text-sm mb-4 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                  <Link
                    to={`/blog/${key}`}
                    className="text-primary-400 hover:text-primary-300 font-medium text-sm flex items-center group transition-colors"
                  >
                    Read More
                    <ArrowLeft size={14} className="ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Card>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;