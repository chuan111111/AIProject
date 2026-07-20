# qwenAgent 云函数

该函数是小程序与阿里云百炼 Qwen3.7-Plus 之间的服务端代理。API Key 不得写入本目录或小程序代码。

部署后，在云开发控制台的云函数配置中添加环境变量：

- `DASHSCOPE_API_KEY`：必填，百炼 API Key；
- `QWEN_MODEL`：可选，默认 `qwen3.7-plus`；
- `QWEN_API_URL`：可选，默认北京地域 OpenAI 兼容 Chat 地址。如果 API Key 创建页面显示了不同的 API Host，请填写对应的 `/chat/completions` 完整地址。

建议把函数超时时间设置为 30 秒，然后重新部署。
