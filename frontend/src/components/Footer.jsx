import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">简历模板站</h3>
            <p className="text-gray-400">
              专业简历制作平台，帮助您打造令人印象深刻的求职简历。
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">产品服务</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/templates" className="hover:text-white">免费模板</Link></li>
              <li><Link to="/pro" className="hover:text-white">会员特权</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">帮助支持</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/faq" className="hover:text-white">常见问题</Link></li>
              <li><Link to="/contact" className="hover:text-white">联系我们</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">法律信息</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/privacy" className="hover:text-white">隐私政策</Link></li>
              <li><Link to="/terms" className="hover:text-white">服务条款</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 简历模板站. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
