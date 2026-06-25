import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Heart, User } from 'lucide-react';

function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <FileText className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900">简历模板站</span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary-600">首页</Link>
            <Link to="/templates" className="text-sm font-medium text-gray-600 hover:text-primary-600">模板中心</Link>
            <Link to="/pro" className="text-sm font-medium text-gray-600 hover:text-primary-600">会员中心</Link>
          </nav>

          {/* 用户入口（免登录版） */}
          <div className="flex items-center gap-2">
            <Link
              to="/user"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <User size={18} />
              <span className="hidden sm:inline">我的简历</span>
            </Link>
            <Link
              to="/user"
              state={{ tab: 'favorites' }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Heart size={18} />
              <span className="hidden sm:inline">我的收藏</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
