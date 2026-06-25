-- 预设模板数据（模板内容在Task 10详细设计）
INSERT INTO templates (name, name_en, category, language, thumbnail, style_data, is_pro, is_featured) VALUES
('简约经典', 'Classic Simple', 'simple', 'chinese', '/thumbnails/template1.jpg', '{"type":"simple","primaryColor":"#2563eb","font":"system-ui"}', 0, 1),
('专业商务', 'Professional Business', 'professional', 'chinese', '/thumbnails/template2.jpg', '{"type":"professional","primaryColor":"#1e293b","font":"Georgia"}', 0, 1),
('创意多彩', 'Creative Colorful', 'creative', 'chinese', '/thumbnails/template3.jpg', '{"type":"creative","primaryColor":"#7c3aed","font":"Poppins"}', 0, 0),
('技术大牛', 'Tech Expert', 'tech', 'chinese', '/thumbnails/template4.jpg', '{"type":"tech","primaryColor":"#059669","font":"Fira Code"}', 1, 1),
('管理精英', 'Management Elite', 'management', 'chinese', '/thumbnails/template5.jpg', '{"type":"management","primaryColor":"#dc2626","font":"Arial"}', 1, 0);
