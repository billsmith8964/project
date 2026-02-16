# TalentBridge MVP

一个 Upwork 风格的简化演示站点：

- 企业可以发布任务（标题、预算、技能、描述）
- 个人可以上传简历（姓名、职位、技能、简介）
- 所有数据保存在浏览器 `localStorage`

## 本地运行

```bash
python3 -m http.server 8000
```

然后访问：<http://localhost:8000>

## 测试

```bash
python3 tests/smoke_test.py
```
