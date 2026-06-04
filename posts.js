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
