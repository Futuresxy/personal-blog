(function () {
  const tracks = [
    { id: "kvcache", label: "KVCache 项目", short: "KV", color: "accent" },
    { id: "leetcode", label: "力扣刷题", short: "LC", color: "coral" },
    { id: "operator", label: "算子学习优化", short: "OP", color: "blue" },
    { id: "paper", label: "Paper 阅读", short: "PA", color: "gold" },
    { id: "platform", label: "Ascend / RTX4090 实验平台", short: "HW", color: "accent" }
  ];

  const milestones = [
    {
      date: "2026-07-07",
      title: "KV 容量与延迟模型 v1",
      detail: "完成 KV 容量公式、MHA/GQA/MQA/MLA 配置、Prefill/Decode 基础模型和第一版图表。"
    },
    {
      date: "2026-07-14",
      title: "Serving Simulator v1",
      detail: "完成 PagedAttention、continuous batching、prefix reuse、碎片率和 P99 统计。"
    },
    {
      date: "2026-07-21",
      title: "压缩与分层报告 v2",
      detail: "完成 KV 压缩、HBM/DRAM/NVMe/remote 分层、prefetch/evict 和多租户隔离代理。"
    },
    {
      date: "2026-07-28",
      title: "算子与硬件模型 v3",
      detail: "完成 Roofline、FlashAttention/FlashDecoding 笔记、RTX/Ascend microbenchmark 设计。"
    },
    {
      date: "2026-08-05",
      title: "秋招项目冻结",
      detail: "README、简历 bullet、5 组 benchmark、项目追问、模拟面试和 2 页论文摘要完成。"
    },
    {
      date: "2026-08-20",
      title: "论文中期检查",
      detail: "RTX4090 与 Ascend 910C 的 E0/E1/E2 完成，论文 introduction、method、evaluation setup 成形。"
    },
    {
      date: "2026-09-05",
      title: "ASPLOS 实验冻结",
      detail: "E0-E6 核心实验、8 到 10 张主图、完整论文 v1 和 artifact README 完成。"
    },
    {
      date: "2026-09-09",
      title: "ASPLOS full paper 提交",
      detail: "完成匿名、格式、图表、引用和提交检查，在 AoE 截止前提交。"
    }
  ];

  const rawPlans = [
    {
      date: "2026-06-30",
      title: "定题与脚手架",
      focus: "把 KVSim-X 变成可执行项目，而不是停留在想法。",
      tasks: {
        kvcache: "创建 KVSim-X 仓库结构 | sim、models、scheduler、compression、tiers、benchmarks、profiles、docs、paper。",
        leetcode: "数组/哈希 2 题 | 建立错题表，记录耗时、错误原因和复盘日期。",
        operator: "整理算子学习入口 | 列出 CUDA/Triton/Ascend C、FlashAttention、FlashDecoding 的学习清单。",
        paper: "写 paper/outline.md | 包含标题、摘要草稿、贡献草稿和 8 张预期图。",
        platform: "登记实验平台 | 记录 Ascend 910C 16 卡、Ascend 950 4 卡、RTX4090 的登录方式、驱动和工具链状态。"
      }
    },
    {
      date: "2026-07-01",
      title: "Transformer 与 KV 形态",
      focus: "能白板说明 MHA/GQA/MQA/MLA 的 KV Cache 差异。",
      tasks: {
        kvcache: "实现 ModelConfig | 支持 layers、hidden size、heads、kv heads、head dim、dtype、context length。",
        leetcode: "双指针与滑动窗口 2 题 | 每题写复杂度和边界条件。",
        operator: "复习 attention 基础算子 | 写出 QK^T、softmax、PV 的数据流。",
        paper: "阅读 PagedAttention 摘要与 introduction | 记录它解决的显存碎片问题。",
        platform: "检查 RTX4090 Python 环境 | 确认 PyTorch、CUDA、Triton 或替代环境可用。"
      }
    },
    {
      date: "2026-07-02",
      title: "Prefill / Decode 建模",
      focus: "把计算量、访存量和 TTFT/TPOT 关联起来。",
      tasks: {
        kvcache: "实现 ExecutionModel | 输出 prefill FLOPs、decode bytes、KV 读写量和粗略 latency。",
        leetcode: "二分与栈 2 题 | 重点处理边界和空栈。",
        operator: "写 decode attention 伪代码 | 标明 KV 读取、softmax 和输出写回。",
        paper: "整理长上下文瓶颈笔记 | 写 500 字说明为什么 decode 常被 KV 访存限制。",
        platform: "设计 RTX4090 microbenchmark | 准备 HBM copy、KV copy、dtype conversion 测试脚本草案。"
      }
    },
    {
      date: "2026-07-03",
      title: "KV Layout 与 Allocator",
      focus: "实现 naive allocator 和 block/page 基础结构。",
      tasks: {
        kvcache: "实现 contiguous allocator | 记录 OOM 点、碎片率和 request admission。",
        leetcode: "数组综合 2 题 | 复盘输入规模和复杂度选择。",
        operator: "学习 memory coalescing | 对比连续 KV 和 paged KV 的访存差异。",
        paper: "补 related work 表格 | 增加 vLLM、SGLang、KV compression、offloading。",
        platform: "检查 Ascend 910C 工具链 | 记录 CANN、npu-smi、profiling 工具是否可用。"
      }
    },
    {
      date: "2026-07-04",
      title: "PagedAttention 核心结构",
      focus: "做出 block table 和 page allocation 第一版。",
      tasks: {
        kvcache: "实现 paged allocator | 支持 block size 参数、block table 和 free list。",
        leetcode: "树基础 2 题 | DFS/BFS 各 1 题。",
        operator: "分析 PagedAttention 访存模式 | 写出 block indirection 带来的额外开销。",
        paper: "精读 PagedAttention 方法部分 | 提炼 3 个能用于面试的追问答案。",
        platform: "准备 Ascend 910C 单卡 KV copy 测试 | 明确输入 shape、dtype 和测量指标。"
      }
    },
    {
      date: "2026-07-05",
      title: "Workload 与指标",
      focus: "把 simulator 接入 workload generator。",
      tasks: {
        kvcache: "实现 WorkloadGenerator | 支持 prompt length、decode length、arrival rate、tenant、prefix ratio。",
        leetcode: "堆与优先队列 2 题 | 重点 top-k 和合并场景。",
        operator: "学习 kernel latency 统计口径 | 区分 launch overhead、执行时间和同步时间。",
        paper: "写 motivation 1 页 | 解释长上下文和高并发下 KV Cache 为什么成为瓶颈。",
        platform: "定义 platform_profile.json | 写入 bandwidth、latency、capacity、kernel_overhead 字段。"
      }
    },
    {
      date: "2026-07-06",
      title: "首批实验",
      focus: "跑出短上下文、长上下文、高并发 3 组图。",
      tasks: {
        kvcache: "生成 E1 初版图表 | 对比 contiguous 与 paged 的 HBM usage 和 OOM 点。",
        leetcode: "回溯 2 题 | 练习状态恢复和剪枝。",
        operator: "复习 softmax 数值稳定 | 写出 max-subtraction 版本伪代码。",
        paper: "画 Figure 1 草图 | KV memory explosion with context length。",
        platform: "RTX4090 跑第一个 copy benchmark | 记录命令、shape、结果和误差。"
      }
    },
    {
      date: "2026-07-07",
      title: "报告 v1",
      focus: "完成 KV 容量与延迟瓶颈报告。",
      tasks: {
        kvcache: "整理 report_v1.md | 包含公式、3 组实验、关键图和局限。",
        leetcode: "Week 1 错题复盘 | 重写 4 道错题，补模板。",
        operator: "总结 attention 数据流 | 输出一张 prefill/decode 对比图。",
        paper: "更新 extended abstract | 加入第一周实验观察。",
        platform: "整理 RTX4090 和 Ascend 环境记录 | 标注可跑、待修复和缺失依赖。"
      }
    },
    {
      date: "2026-07-08",
      title: "vLLM BlockManager",
      focus: "把 vLLM 的 BlockManager 映射到自己的 simulator。",
      tasks: {
        kvcache: "阅读并复刻 BlockManager 关键接口 | allocate、free、append、swap 或等价抽象。",
        leetcode: "树与 DFS 2 题 | 重点递归返回值设计。",
        operator: "阅读 vLLM attention backend 入口 | 标出 KV block table 如何进入算子。",
        paper: "补 PagedAttention related work | 记录 claim、方法和可对比指标。",
        platform: "验证 Ascend 910C profiling 命令 | 至少跑通一个空 workload 或简单 copy。"
      }
    },
    {
      date: "2026-07-09",
      title: "Continuous Batching",
      focus: "实现请求进入、prefill、decode step 的事件循环。",
      tasks: {
        kvcache: "实现 Scheduler v1 | 支持 waiting、prefill、decode、finished 队列。",
        leetcode: "BFS 与队列 2 题 | 记录层序和多源 BFS 模板。",
        operator: "学习 CPU/GPU overlap | 记录 launch、copy、compute 之间的重叠方式。",
        paper: "阅读 LLM serving 调度论文或博客 1 篇 | 提炼 TTFT/TPOT 权衡。",
        platform: "设计 910C 单卡 serving proxy | 明确 batch、seq、dtype、loop 结构。"
      }
    },
    {
      date: "2026-07-10",
      title: "Eviction 策略",
      focus: "让缓存策略可替换、可比较。",
      tasks: {
        kvcache: "实现 LRU、LFU、size-aware eviction | 输出 hit rate、miss penalty、bytes moved。",
        leetcode: "LRU/LFU 手撕 | 各写一版，控制在 25 分钟内。",
        operator: "学习 KV copy kernel 优化点 | 对齐、向量化、连续访问、block size。",
        paper: "整理 offloading 相关工作 | 关注 HBM/DRAM/NVMe 分层。",
        platform: "RTX4090 跑不同 block size copy | 记录 8/16/32/64 token 粒度差异。"
      }
    },
    {
      date: "2026-07-11",
      title: "Prefix Reuse",
      focus: "实现 prefix sharing / radix cache 简化模型。",
      tasks: {
        kvcache: "实现 prefix reuse model | 支持 prefix sharing ratio 和 block reuse 统计。",
        leetcode: "Trie 与字符串 2 题 | 对应 prefix cache 的数据结构思路。",
        operator: "分析 prefix cache 对 prefill 的影响 | 区分减少计算和减少 KV 写入。",
        paper: "阅读 SGLang radix cache 资料 | 整理和普通 KV cache 的区别。",
        platform: "准备 prefix reuse trace | 构造 0%、25%、50%、75% 共享比例。"
      }
    },
    {
      date: "2026-07-12",
      title: "碎片与复用指标",
      focus: "把内存管理指标做扎实。",
      tasks: {
        kvcache: "实现 fragmentation 指标 | internal、external、free block distribution。",
        leetcode: "堆和模拟 2 题 | 训练调度类问题。",
        operator: "记录 block table indirection 开销 | 明确 simulator 中如何建模。",
        paper: "写 evaluation metrics 草稿 | TTFT、TPOT、P99、HBM usage、fragmentation。",
        platform: "910C 跑 block size 敏感性小实验 | 记录是否可稳定复现。"
      }
    },
    {
      date: "2026-07-13",
      title: "P99 与可视化",
      focus: "让结果能服务简历和论文图表。",
      tasks: {
        kvcache: "实现 P50/P90/P99 和图表导出 | 至少输出 latency-throughput 曲线。",
        leetcode: "Week 2 高频题 2 题 | 树/堆/回溯混合。",
        operator: "学习 profiling 结果可视化 | 整理 latency breakdown 图模板。",
        paper: "画 Figure 5 草图 | latency-throughput curve。",
        platform: "统一 RTX 和 Ascend 实验日志格式 | 命令、commit、平台、参数、结果。"
      }
    },
    {
      date: "2026-07-14",
      title: "Serving Simulator v1 答辩",
      focus: "能讲清楚 vLLM 为什么需要 PagedAttention。",
      tasks: {
        kvcache: "完成 report_v1.5.md | 覆盖 scheduler、paged cache、prefix reuse、碎片和 P99。",
        leetcode: "Week 2 错题复盘 | 重写 4 道错题。",
        operator: "口述 PagedAttention 算子路径 | 从 block table 到 KV 读取。",
        paper: "更新 related work 表格 | 明确 baseline 和差异。",
        platform: "整理 E0/E1 待跑列表 | 标注 RTX4090、910C、950 的优先级。"
      }
    },
    {
      date: "2026-07-15",
      title: "KV dtype 与压缩模型",
      focus: "把 BF16/FP16、FP8、INT8、INT4 的容量收益建出来。",
      tasks: {
        kvcache: "实现 CompressionModel v1 | 支持不同 bit-width、粒度和容量收益。",
        leetcode: "DP 入门 2 题 | 明确状态定义和转移。",
        operator: "学习 dequant kernel 数据流 | 记录 scale、zero point、vector load。",
        paper: "阅读 KV compression 论文 1 篇 | 记录压缩率、精度和性能指标。",
        platform: "RTX4090 设计 dequant toy kernel | 先写 Triton 或 CUDA 版本接口。"
      }
    },
    {
      date: "2026-07-16",
      title: "压缩/解压延迟",
      focus: "把压缩收益和解压开销放进同一模型。",
      tasks: {
        kvcache: "实现 compression latency | 支持 on-write、on-evict、on-read、prefetch-decompress。",
        leetcode: "背包类 DP 2 题 | 记录一维优化模板。",
        operator: "实现或伪实现 KV dequant | 输出 latency 参数占位。",
        paper: "写 E3 实验设计 | 定义 dtype、granularity、timing、accuracy proxy。",
        platform: "Ascend 910C 准备 dtype conversion benchmark | 记录可用 API 和输入 shape。"
      }
    },
    {
      date: "2026-07-17",
      title: "异构存储层级",
      focus: "建立 HBM -> DRAM -> NVMe/remote tier。",
      tasks: {
        kvcache: "实现 TierModel v1 | 支持 capacity、bandwidth、latency、transfer cost。",
        leetcode: "LIS 与序列 DP 2 题 | 复盘二分优化。",
        operator: "学习 host-device transfer | 记录同步/异步 copy 差异。",
        paper: "整理 offload/tiering 论文对比 | 关注 tail latency。",
        platform: "测 RTX4090 host-device bandwidth | 记录 pinned 与 pageable 差异。"
      }
    },
    {
      date: "2026-07-18",
      title: "Prefetch 与 Evict",
      focus: "开始量化 stall time。",
      tasks: {
        kvcache: "实现 prefetch/evict 策略 | 输出 stall ratio、prefetch hit rate、miss penalty。",
        leetcode: "区间 DP 或状态 DP 2 题 | 强化状态边界。",
        operator: "学习通信/计算 overlap 基础 | 记录 stream/event 或等价机制。",
        paper: "写 E4 实验设计 | no offload、LRU、LFU、token-age、layer-aware、SLA-aware。",
        platform: "910C 测 host-device 搬移 | 记录带宽、latency 和稳定性。"
      }
    },
    {
      date: "2026-07-19",
      title: "通信与远端 KV",
      focus: "把 RDMA/PCIe/NVLink/NPU 通信参数化。",
      tasks: {
        kvcache: "实现 communication cost model | 支持 local、host、remote、多卡通信层级。",
        leetcode: "图论基础 2 题 | BFS/DFS 建图。",
        operator: "学习 all-reduce/all-gather 场景 | 关联 TP/CP 对 KV 的影响。",
        paper: "整理 PD 分离和远端 KV 背景 | 记录网络开销如何抵消缓存收益。",
        platform: "910C 多卡通信测试方案 | 明确 1/4/8/16 卡 scaling 变量。"
      }
    },
    {
      date: "2026-07-20",
      title: "多租户隔离",
      focus: "让 cache 策略能解释公平性和污染问题。",
      tasks: {
        kvcache: "实现 tenant-aware policy | quota、priority、shared pool 和 SLA-aware eviction。",
        leetcode: "并查集 2 题 | 记录路径压缩和按秩合并。",
        operator: "分析多租户 workload 对 kernel batching 的影响 | 记录可能的抖动来源。",
        paper: "写 multi-tenant evaluation 草稿 | tenant P99、fairness、cache pollution。",
        platform: "构造多租户 trace | tenant 数 1/4/16/64，prefix sharing 0%-75%。"
      }
    },
    {
      date: "2026-07-21",
      title: "压缩与分层报告 v2",
      focus: "完成容量、延迟、带宽、P99 的 trade-off 报告。",
      tasks: {
        kvcache: "整理 report_v2.md | 包含 compression、tiering、prefetch、多租户初版。",
        leetcode: "Week 3 DP 错题复盘 | 重写 4 道错题。",
        operator: "总结 dequant/copy/offload 路径 | 画出数据搬移图。",
        paper: "更新 method 草稿 | 写联合建模的系统设计。",
        platform: "整理 E3/E4 实验脚本 TODO | 区分 RTX、910C、950。"
      }
    },
    {
      date: "2026-07-22",
      title: "Roofline 模型",
      focus: "判断 compute-bound 与 memory-bound。",
      tasks: {
        kvcache: "实现 RooflineModel | 输入 FLOPs、bytes、compute peak、bandwidth，输出瓶颈类型。",
        leetcode: "拓扑排序 2 题 | 记录入度模板。",
        operator: "复习 Roofline | 计算 arithmetic intensity。",
        paper: "写 platform calibration 章节草稿 | 说明为什么需要实测校准。",
        platform: "收集 RTX4090 理论峰值和实测带宽 | 写入 profiles/rtx4090.json。"
      }
    },
    {
      date: "2026-07-23",
      title: "Attention FLOPs / Bytes",
      focus: "解释 decode 为什么常被 KV 读带宽限制。",
      tasks: {
        kvcache: "完善 attention cost model | 分别输出 prefill FLOPs、decode bytes、KV read amplification。",
        leetcode: "最短路 2 题 | Dijkstra 和多源 BFS 各 1 题。",
        operator: "写 attention breakdown 脚本 | 输出 QK、softmax、PV、KV load 估计。",
        paper: "画 Figure 2 草图 | Decode latency breakdown。",
        platform: "910C 单卡 profile 写入 JSON | 至少填 capacity、bandwidth、copy latency 占位。"
      }
    },
    {
      date: "2026-07-24",
      title: "FlashAttention / FlashDecoding",
      focus: "写 IO-aware attention 笔记。",
      tasks: {
        kvcache: "把 FlashAttention/Decoding 作为 operator backend 参数 | simulator 支持不同 latency profile。",
        leetcode: "图论综合 2 题 | 并查集/拓扑/最短路混合。",
        operator: "阅读 FlashAttention/FlashDecoding 核心思想 | 输出 1000 字笔记。",
        paper: "补 related work：IO-aware attention | 明确与 KV 管理的边界。",
        platform: "确认 RTX4090 profiler 工具 | Nsight 或 torch profiler 跑通一个 toy kernel。"
      }
    },
    {
      date: "2026-07-25",
      title: "RTX4090 Toy Kernel",
      focus: "写 KV copy、KV dequant 或 decode attention 三选一。",
      tasks: {
        kvcache: "接入 operator profile 接口 | simulator 能读取 microbenchmark latency。",
        leetcode: "单调栈 2 题 | 记录 next greater / histogram 模板。",
        operator: "实现 Triton/CUDA toy kernel | 先完成可运行和正确性检查。",
        paper: "记录 microbenchmark 方法 | 写清 shape、dtype、warmup、重复次数。",
        platform: "RTX4090 跑 toy kernel benchmark | 输出第一版 latency 表。"
      }
    },
    {
      date: "2026-07-26",
      title: "Ascend Microbenchmark",
      focus: "准备 Ascend 上等价 KV copy / dtype conversion / 简化 decode。",
      tasks: {
        kvcache: "定义 Ascend operator profile 字段 | 保持与 RTX profile 可比较。",
        leetcode: "前缀和 2 题 | 练习区间统计和哈希结合。",
        operator: "实现 Ascend benchmark 草案 | 优先保证能编译或能用框架 API 跑。",
        paper: "写 cross-platform motivation | 强调 GPU-centric 策略未必迁移。",
        platform: "Ascend 910C 跑通一个 microbenchmark | 记录失败原因也算有效产出。"
      }
    },
    {
      date: "2026-07-27",
      title: "通信/计算 Overlap",
      focus: "模拟 TP/PP/CP 下通信开销代理。",
      tasks: {
        kvcache: "实现 overlap model | 支持 no-overlap、partial-overlap、full-overlap 三种模式。",
        leetcode: "位运算 2 题 | 记录 mask 和状态压缩基础。",
        operator: "学习 stream/event 或 Ascend 等价机制 | 整理 overlap 的实现条件。",
        paper: "写 ablation 设计 | 无压缩、无预取、无分层、无平台校准。",
        platform: "设计 910C 4/8/16 卡 scaling 脚本 | 明确日志路径和参数。"
      }
    },
    {
      date: "2026-07-28",
      title: "算子与硬件报告 v3",
      focus: "完成算子、HBM、网络瓶颈归因。",
      tasks: {
        kvcache: "整理 report_v3.md | 包含 Roofline、operator profile、communication overlap。",
        leetcode: "Week 4 图论错题复盘 | 重写 4 道错题。",
        operator: "整理 toy kernel 结果 | 画 latency breakdown。",
        paper: "更新 Figure 3 架构图 | 展示 simulator、profile、policy selector。",
        platform: "整理平台 profile v1 | RTX4090 和 910C 至少各有一份 JSON。"
      }
    },
    {
      date: "2026-07-29",
      title: "README 与 Demo",
      focus: "让项目 5 分钟内能跑起来。",
      tasks: {
        kvcache: "写 README 快速开始 | 一条命令跑 baseline、paged、compressed、tiered、prefix-reuse。",
        leetcode: "字符串与 Trie 2 题 | 对应 prefix reuse 场景。",
        operator: "整理算子学习笔记目录 | 把已读内容链接到博客。",
        paper: "写 ASPLOS story v1 | problem、insight、design、result。",
        platform: "写实验复现说明 | 包含 RTX4090 和 Ascend 的环境变量、命令、输出路径。"
      }
    },
    {
      date: "2026-07-30",
      title: "5 组 Benchmark",
      focus: "形成简历能引用的量化结果。",
      tasks: {
        kvcache: "跑 5 个 benchmark case | baseline、paged、compressed、tiered、prefix-reuse。",
        leetcode: "综合模拟 2 题 | 训练代码组织。",
        operator: "把 toy kernel latency 接入图表 | 与 simulator 预测对齐。",
        paper: "写 evaluation setup 初稿 | model、workload、platform、metrics。",
        platform: "检查所有 benchmark 日志 | 确保 commit、日期、平台和参数可追踪。"
      }
    },
    {
      date: "2026-07-31",
      title: "关键图表",
      focus: "完成 TTFT/TPOT、HBM usage、bytes moved、fragmentation。",
      tasks: {
        kvcache: "导出 4 张关键图 | 用于 README、简历和论文初稿。",
        leetcode: "Hard 1 题 + 错题 1 题 | 严格计时。",
        operator: "总结 memory-bound 证据 | 对齐 Roofline 输出和 benchmark。",
        paper: "更新 Figure 4/5 草图 | prediction error 和 latency-throughput curve。",
        platform: "补跑缺失的 RTX4090 baseline | 确保有 NVIDIA 对照。"
      }
    },
    {
      date: "2026-08-01",
      title: "项目复盘",
      focus: "把做了什么、为什么、trade-off、局限写清楚。",
      tasks: {
        kvcache: "写 project_retrospective.md | 包含系统设计、策略取舍、误差来源、下一步。",
        leetcode: "高频题 2 题 | 二分/栈/堆混合。",
        operator: "整理算子 FAQ | FlashAttention、FlashDecoding、dequant、copy。",
        paper: "写 introduction v1 | 前 2 页必须能讲清问题和贡献。",
        platform: "整理 Ascend 平台风险 | 记录无法复现实验和降级方案。"
      }
    },
    {
      date: "2026-08-02",
      title: "项目追问",
      focus: "准备 30 个项目追问答案。",
      tasks: {
        kvcache: "整理 project_qa.md | 覆盖 KV 公式、PagedAttention、压缩、分层、P99、跨平台差异。",
        leetcode: "手撕 LRU + top-k | 控制在 25 分钟内。",
        operator: "口述 decode attention 瓶颈 | 录音或写文字稿。",
        paper: "写 contributions v1 | 每条贡献都对应实验图。",
        platform: "准备面试可讲的硬件对比 | RTX4090、910C、950 各自作用和风险。"
      }
    },
    {
      date: "2026-08-03",
      title: "模拟面试",
      focus: "项目 20 分钟 + 系统设计 20 分钟 + 算法 40 分钟。",
      tasks: {
        kvcache: "完成模拟面试复盘 | 记录被问倒的问题并补答案。",
        leetcode: "模拟笔试 3 题 | 90 分钟内完成并复盘。",
        operator: "手撕 softmax/attention 伪代码 | 强调数值稳定和访存。",
        paper: "完成 2 页 extended abstract | 留作 8 月后投稿冲刺起点。",
        platform: "确认 8 月实验队列 | 排定 910C 多卡、950 单卡/4 卡、RTX 补实验。"
      }
    },
    {
      date: "2026-08-04",
      title: "简历冻结",
      focus: "把项目压缩成 3 条有指标的 bullet。",
      tasks: {
        kvcache: "打磨简历 bullet | AI Infra、系统/HPC、后端保底 3 个版本。",
        leetcode: "错题复盘 | 只做高频错题，不开新专题。",
        operator: "整理算子优化简历讲法 | 说明 toy kernel 与真实推理系统的关系。",
        paper: "列论文实验 TODO | 8/6-9/9 每周目标明确。",
        platform: "整理 profile 表格 | 当前实测、待测、fallback 全部列清。"
      }
    },
    {
      date: "2026-08-05",
      title: "秋招交付冻结",
      focus: "保证投递当天项目、简历、问答、算法状态可用。",
      tasks: {
        kvcache: "冻结 demo 和 README | 保证 5 分钟可以展示项目主流程。",
        leetcode: "最终错题清单 | 标出面试前 30 分钟复习题。",
        operator: "冻结算子笔记 | FlashAttention、FlashDecoding、Roofline、dequant/copy。",
        paper: "归档 2 页摘要和实验计划 | 8 月 6 日后继续论文冲刺。",
        platform: "归档实验平台状态 | 明确哪些数据可用于秋招，哪些留给论文。"
      }
    }
  ];

  window.PROGRESS_BOARD = {
    lastUpdated: "2026-06-30",
    tracks,
    milestones,
    dailyPlans: rawPlans.map((plan) => ({
      ...plan,
      tasks: tracks.map((track) => {
        const raw = plan.tasks[track.id] || "";
        const [title, detail = ""] = raw.split(" | ");
        return {
          id: `${plan.date}-${track.id}`,
          track: track.id,
          title,
          detail,
          priority: track.id === "kvcache" ? "P0" : "P1"
        };
      })
    }))
  };
}());
