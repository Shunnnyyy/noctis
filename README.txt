NOCTIS v3 - noctis-lake

运行方式：
1. 双击 index.html 打开首页。
2. 点击 Enter Map 进入多伦多夜间光地图。
3. 地图页面需要联网，因为使用 OpenStreetMap 地图瓦片和 Leaflet。

功能：
- 首页有生成式夜间地图视觉、项目状态和入口。
- 地图页可以按 All / Commercial / Residential / Favorites 过滤。
- 可以搜索标题、时间、状态、观察和分析内容。
- 可以添加摄影点、上传照片、编辑区域、状态、时间、光强、观察和分析。
- 可以收藏点位、删除点位、聚焦当前结果，以及导出 JSON 备份。

说明：
- 新增点和图片保存在浏览器 localStorage 里。
- 如果换浏览器或清除缓存，新增内容会消失。
- 后续可以升级成 Supabase 数据库版本，用于跨设备同步和公开投稿。
