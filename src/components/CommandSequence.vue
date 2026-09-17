<script setup>
import { computed } from 'vue'
import { parseCommand } from '../data/commandTerms.js'
const props = defineProps({
  command: { type: String, required: true },
  characterId: { type: String, default: '' },
  showTerms: Boolean,
})
const steps = computed(() => parseCommand(props.command, props.characterId))
const separators = { '>': '取消', ',': '目押 / 追击', '~': '连打 / 派生' }
</script>
<template>
  <div class="command-sequence" :aria-label="`输入指令：${command}`">
    <span v-for="(step, index) in steps" :key="index" class="command-unit"
      ><span
        v-if="step.separator"
        class="command-separator"
        :title="separators[step.separator]"
        aria-hidden="true"
        >{{ step.separator === ',' ? '›' : step.separator === '~' ? '~' : '→' }}</span
      ><span class="command-step"
        ><code
          :class="{
            'kick-command': /K/.test(step.command),
            'punch-command': /P/.test(step.command),
          }"
          >{{ step.command }}</code
        ><small
          v-if="showTerms && step.term"
          class="command-term"
          :class="{ 'drive-rush-term': step.isDriveRush }"
          ><template v-if="step.isDriveRush"
            ><span class="drive-rush-badge" :title="step.driveRushMode ? '取消绿冲' : '绿冲起手'"
              >绿冲</span
            ><span
              >{{ step.driveRushMode ? `${step.driveRushMode} · ` : ''
              }}{{ step.term.replace(/^(?:取消绿冲|绿冲) · /, '') }}</span
            ></template
          ><template v-else>{{ step.term }}</template></small
        ></span
      ></span
    >
  </div>
</template>
