window.SITE_PROFILE = {
  name: "Futuresxy",
  role: "LLM 推理系统学习者 / Python 工程实践者",
  headline: "记录 LLM 推理系统、Python 工程和论文阅读中的学习过程。",
  summary: "我目前重点关注大模型推理系统、KV Cache、调度策略、张量并行和工程化实现。这个站点用于整理学习笔记、展示项目积累、沉淀资料索引，并把每天跟踪的论文链接到研究方向里。",
  links: [
    { label: "GitHub", url: "https://github.com/Futuresxy" },
    { label: "Paper Daily", url: "https://futuresxy.github.io/paper-daily/" },
    { label: "个人博客", url: "https://futuresxy.github.io/personal-blog/" }
  ],
  metrics: [
    { value: "LLM", label: "主要学习方向" },
    { value: "vLLM", label: "近期代码阅读" },
    { value: "GitHub", label: "项目与笔记沉淀" },
    { value: "Daily", label: "论文跟踪节奏" }
  ],
  focus: [
    "大模型推理系统与 vLLM 实现",
    "KV Cache、PagedAttention、调度与吞吐优化",
    "Tensor Parallel、CUDA Graph、FlashAttention",
    "Python 工程、代码阅读和实验复现"
  ],
  skills: [
    {
      group: "系统与工程",
      items: ["Python", "PyTorch", "Linux", "Git", "GitHub Pages"]
    },
    {
      group: "LLM 推理",
      items: ["vLLM", "KV Cache", "PagedAttention", "Tensor Parallel", "FlashAttention"]
    },
    {
      group: "学习方法",
      items: ["源码阅读", "论文跟踪", "实验记录", "技术写作"]
    }
  ],
  resume: [
    {
      period: "现在",
      title: "学习与研究：LLM 推理系统",
      detail: "围绕 nano-vLLM / vLLM 阅读核心模块，理解 prefill、decode、调度器、KV cache、张量并行和采样流程。"
    },
    {
      period: "近期",
      title: "项目：个人学习主页与论文跟踪",
      detail: "搭建 GitHub Pages 个人主页，整理学习笔记、资料库，并接入每天拉取论文的 Paper Daily 页面。"
    },
    {
      period: "持续",
      title: "工程实践：把问题写成可复用笔记",
      detail: "把源码阅读中的问题、实验命令、关键结论整理成文章，逐步形成自己的技术知识库。"
    }
  ]
};

window.RESEARCH_INTERESTS = [
  {
    title: "LLM 推理系统",
    tags: ["vLLM", "Serving", "Throughput"],
    description: "关注请求调度、prefill/decode 分离、批处理策略、吞吐和延迟之间的权衡。",
    link: "https://docs.vllm.ai/"
  },
  {
    title: "KV Cache 与 PagedAttention",
    tags: ["KV Cache", "Prefix Cache", "Memory"],
    description: "理解 KV cache block 管理、prefix cache、chunked prefill 和显存利用率优化。",
    link: "https://arxiv.org/abs/2309.06180"
  },
  {
    title: "并行推理与算子优化",
    tags: ["Tensor Parallel", "CUDA Graph", "FlashAttention"],
    description: "关注张量并行切分、all-reduce/gather 通信、FlashAttention 与 CUDA Graph 对推理性能的影响。",
    link: "https://pytorch.org/docs/stable/distributed.html"
  },
  {
    title: "论文跟踪与技术复现",
    tags: ["Paper Daily", "Reading", "Reproduce"],
    description: "每天跟踪相关论文，筛选值得深入阅读和复现的工作。",
    link: "https://futuresxy.github.io/paper-daily/"
  }
];

window.RESOURCE_LIBRARY = [
  {
    title: "vLLM 官方文档",
    type: "文档",
    topic: "LLM 推理",
    description: "理解 vLLM serving、PagedAttention、调度和部署方式的首选入口。",
    url: "https://docs.vllm.ai/"
  },
  {
    title: "PyTorch Distributed",
    type: "文档",
    topic: "分布式",
    description: "学习 ProcessGroup、NCCL、all-reduce、gather 等张量并行通信基础。",
    url: "https://pytorch.org/docs/stable/distributed.html"
  },
  {
    title: "FlashAttention",
    type: "论文 / 代码",
    topic: "Attention",
    description: "高性能 attention 的重要实现，对理解现代推理系统很有帮助。",
    url: "https://github.com/Dao-AILab/flash-attention"
  },
  {
    title: "Attention Is All You Need",
    type: "论文",
    topic: "Transformer",
    description: "Transformer 原始论文，适合回看 attention、位置编码和 decoder-only 模型基础。",
    url: "https://arxiv.org/abs/1706.03762"
  },
  {
    title: "Paper Daily",
    type: "个人工具",
    topic: "论文跟踪",
    description: "我每天拉取论文的页面，用于持续观察 LLM、系统和相关研究动态。",
    url: "https://futuresxy.github.io/paper-daily/"
  },
  {
    title: "GitHub: Futuresxy",
    type: "个人项目",
    topic: "工程实践",
    description: "个人项目、学习代码和后续博客源码都会沉淀在 GitHub 账号下。",
    url: "https://github.com/Futuresxy"
  }
];

window.BLOG_POSTS = [
  {
    id: "nano-vllm-tp",
    title: "nano-vLLM 学习：张量并行到底在并行什么",
    date: "2026-06-04",
    tags: ["vLLM", "推理系统", "Tensor Parallel"],
    excerpt: "用一个小型推理框架理解 QKV 权重切分、row parallel all-reduce、vocab parallel gather 的作用。",
    content: [
      "张量并行不是把一个 Python 线程拆成多个线程，而是把模型权重和计算拆给多个 rank，通常每个 rank 对应一张 GPU。",
      "",
      "## QKV 投影",
      "在 attention 里，Q/K/V 投影通常按输出维度切分。每个 rank 只负责一部分 heads，因此投影之后不一定立刻 all-reduce。",
      "",
      "## 输出投影",
      "attention 的输出投影是 row parallel。每个 rank 计算部分乘法结果，最后通过 all-reduce 把部分和合并成完整 hidden state。",
      "",
      "## 学习重点",
      "- column parallel 常见于 qkv_proj 和 gate_up_proj",
      "- row parallel 常见于 o_proj 和 down_proj",
      "- lm_head 按词表切分时，最后通常 gather 到 rank0 做采样"
    ].join("\n")
  },
  {
    id: "prefill-prefix-cache",
    title: "chunked prefill 和 prefix cache 的区别",
    date: "2026-06-04",
    tags: ["vLLM", "KV Cache", "调度"],
    excerpt: "chunked prefill 解决长 prompt 一次处理太重的问题，prefix cache 解决重复前缀反复计算的问题。",
    content: [
      "prefill 是把 prompt token 喂进模型，并把对应的 K/V 写入 KV cache。",
      "",
      "## chunked prefill",
      "当 prompt 很长时，可以分成多个 chunk 处理。这样不会让一个长请求长时间占住整批推理资源。",
      "",
      "## prefix cache",
      "当多个请求有相同前缀时，后来的请求可以直接复用已经算好的 KV cache block，避免重复计算。",
      "",
      "一句话区分：chunked prefill 是分批算自己的 prompt；prefix cache 是复用别人已经算过的相同前缀。"
    ].join("\n")
  },
  {
    id: "python-note-habit",
    title: "学习笔记的写法：先记录问题，再整理答案",
    date: "2026-06-03",
    tags: ["学习方法", "Python"],
    excerpt: "对初学者来说，笔记不是复制文档，而是把卡住自己的问题、实验和结论记录清楚。",
    content: [
      "一篇有效的学习笔记可以分成三块：我遇到了什么问题、我怎么验证、最后得到了什么结论。",
      "",
      "## 建议模板",
      "- 背景：我为什么看这段代码",
      "- 问题：哪一行或哪个概念不理解",
      "- 实验：我运行了什么命令或修改了什么代码",
      "- 结论：以后遇到类似问题应该怎么判断",
      "",
      "这样写出来的笔记，过一段时间回来读仍然有用。"
    ].join("\n")
  }
];
