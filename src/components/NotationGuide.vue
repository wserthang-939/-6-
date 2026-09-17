<script setup>
import { ChevronDown, Gamepad2 } from 'lucide-vue-next'
</script>
<template>
  <details class="notation-guide">
    <summary>
      <span><Gamepad2 :size="17" /> 指令怎么看？</span><ChevronDown :size="16" />
    </summary>
    <div class="notation-guide-body">
      <p>以角色朝右为例，数字对应小键盘方向。</p>
      <div class="numpad">
        <span
          v-for="key in ['7 ↖', '8 ↑', '9 ↗', '4 ←', '5 N', '6 →', '1 ↙', '2 ↓', '3 ↘']"
          :key="key"
          >{{ key }}</span
        >
      </div>
      <dl>
        <div>
          <dt>LP / MP / HP</dt>
          <dd>轻拳 / 中拳 / 重拳</dd>
        </div>
        <div>
          <dt>LK / MK / HK</dt>
          <dd>轻脚 / 中脚 / 重脚</dd>
        </div>
        <div>
          <dt>PP / KK</dt>
          <dd>两个拳键 / 两个脚键同时按</dd>
        </div>
        <div>
          <dt>P / K</dt>
          <dd>任意强度拳 / 脚</dd>
        </div>
        <div>
          <dt>→（原记谱 &gt;）</dt>
          <dd>在前招可取消时输入下一招</dd>
        </div>
        <div>
          <dt>›（原记谱 ,）</dt>
          <dd>目押或浮空追击，等待前招结束</dd>
        </div>
        <div>
          <dt>~</dt>
          <dd>连打取消或目标连段派生</dd>
        </div>
        <div>
          <dt>DR / DRC</dt>
          <dd>裸绿冲 / 普通技取消绿冲</dd>
        </div>
        <div>
          <dt>SA / PC</dt>
          <dd>超必杀 / 惩罚康（不等于所有确反）</dd>
        </div>
      </dl>
      <p>236 = ↓↘→；214 = ↓↙←；623 = →↓↘。换边时方向镜像。</p>
    </div>
  </details>
</template>
