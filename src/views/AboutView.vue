<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import { tutorials } from '../data/videos.js'
import { characters } from '../data/characters.js'
import { catalog } from '../data/catalog.js'
import NotationGuide from '../components/NotationGuide.vue'
import FrameGuide from '../components/FrameGuide.vue'
</script>
<template>
  <main class="page about-page">
    <p class="eyebrow"><span></span> ABOUT THE LAB</p>
    <h1>关于研习所</h1>
    <div class="about-intro">
      <p>
        COMBO LAB 是一个街霸 6 非官方学习资料站，也是一个 Vue
        课程实践项目。围绕六名角色，整理拳脚介绍、实用连段、套路思路、教学视频和高手录像。
      </p>
      <p>希望你每次离开这里，都能带走一件值得练习的小事。</p>
    </div>
    <div class="about-grid">
      <section class="about-section">
        <h2>如何使用</h2>
        <ol>
          <li>选择角色，先看一套入门连段。</li>
          <li>展开连段，查看用途、帧数与后续选择；先确认距离和角色状态。</li>
          <li>点击 B站链接，观看原作者的相关教学。</li>
          <li>收藏想练的内容，到训练模式验证。</li>
        </ol>
        <h2>内容与版本</h2>
        <p>
          站内文字为学习整理，并非当前补丁的权威帧数表。连段按经典操作和朝右方向记谱，未逐条在当前游戏中实测；不提供未经测量的伤害值。
        </p>
        <p>
          套路是有条件的对局思路，不保证命中。视频保留已知发布年份或日期，适用补丁以视频说明和游戏内结果为准。搜索收录不保证视频会一直可播放。
        </p>
        <h2>图片与视频来源</h2>
        <p>
          角色立绘来自 Fighters Generation 收录的 Capcom 官方角色美术；角色及相关权利归 Capcom
          和相应权利人所有，不知火舞角色权利归 SNK。本网站未获得官方授权。
        </p>
        <p>本站不托管视频，点击后前往 B站原页面观看，作者署名以视频原页为准。</p>
        <a
          href="https://www.fightersgeneration.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-link"
          >Fighters Generation <ArrowUpRight :size="15"
        /></a>
      </section>
      <section>
        <FrameGuide />
        <NotationGuide />
        <div class="about-section about-stack">
          <h2>一个轻量的 Vue 项目</h2>
          <div class="stack-tags">
            <span
              v-for="tech in [
                'Vue 3',
                'Vite',
                'JavaScript',
                'Vue Router',
                'Pinia',
                'CSS',
                'localStorage',
              ]"
              :key="tech"
              >{{ tech }}</span
            >
          </div>
          <p>
            文章与链接存放在项目数据文件中。收藏仅保存在当前浏览器，没有注册登录、后端数据库或在线讨论区。
          </p>
          <h2>教学来源</h2>
          <a
            v-for="c in characters"
            :key="c.id"
            :href="tutorials.find((v) => v.characterId === c.id).url"
            target="_blank"
            rel="noopener noreferrer"
            class="source-row"
            ><span>{{ c.name }} · B站入门教学</span><ArrowUpRight :size="15"
          /></a>
          <p class="small muted">
            当前收录 {{ catalog.length }} 条资料。每条招式与连段的操作要点中还保留文字参考链接。
          </p>
        </div>
      </section>
    </div>
  </main>
</template>
