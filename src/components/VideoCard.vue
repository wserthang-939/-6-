<script setup>
import { computed } from 'vue'
import { ArrowUpRight, Play, ExternalLink } from 'lucide-vue-next'
import { getCharacter } from '../data/characters.js'
import FavoriteButton from './FavoriteButton.vue'
const props = defineProps({ item: { type: Object, required: true } })
const character = computed(() => getCharacter(props.item.characterId))
</script>

<template>
  <article class="video-card" :style="{ '--character-color': character.color }">
    <a
      :href="item.url"
      target="_blank"
      rel="noopener noreferrer"
      class="video-poster"
      :aria-label="`前往B站观看：${item.title}（新标签页）`"
      ><img :src="character.image" alt="" loading="lazy" width="350" height="400" /><span
        class="poster-label"
        >{{ item.kind === 'match' ? 'MATCH STUDY' : 'VIDEO LESSON' }}</span
      ><span class="poster-character">{{ character.englishName }}</span
      ><span class="poster-play"><Play :size="20" fill="currentColor" /></span
      ><span class="poster-bottom"
        >{{ item.kind === 'match' ? item.matchType : item.topic }}<ArrowUpRight :size="18" /></span
    ></a>
    <div class="video-card-body">
      <div class="video-meta">
        <span class="character-label">{{ character.name }}</span
        ><span>{{ item.kind === 'match' ? item.playerType : item.level }}</span
        ><FavoriteButton :item="item" />
      </div>
      <h3>
        <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
      </h3>
      <template v-if="item.kind === 'match'"
        ><p class="match-player">{{ item.player }} <span>vs</span> {{ item.opponent }}</p>
        <div class="watch-points">
          <span>带着问题看对局</span>
          <ul>
            <li v-for="point in item.watchPoints" :key="point">{{ point }}</li>
          </ul>
        </div></template
      >
      <p v-else class="video-description">{{ item.description }}</p>
      <div class="video-source">
        <span>{{ item.author }}</span
        ><time :datetime="item.date">{{ item.date }}</time>
      </div>
      <a class="video-cta" :href="item.url" target="_blank" rel="noopener noreferrer"
        >前往 B站观看 <ExternalLink :size="15"
      /></a>
    </div>
  </article>
</template>
