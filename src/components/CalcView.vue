<script setup lang="ts">
import { ref } from 'vue'
import { itemsList } from '@/composables/itemList'

const items = ref(itemsList)
const importAH = ref<HTMLTextAreaElement | null>(null)

function importValue() {
  const text = importAH.value.textContent
  const rows = text?.split(/\r?\n/)
  const cleanRows = rows?.filter((row) => findItem(row.split(',')[1]) > 0)
  console.log(cleanRows)

  cleanRows?.forEach((row) => {
    const cols = row.split(',')
    const id = findItem(cols[1])
    items.value[id].price = cols[0]
  })
}

function findItem(name: string): number {
  if (name === undefined) return -1
  const cleanName = name.slice(2, -1)
  console.log(cleanName)
  const result = Object.keys(items.value).find(
    (id) => items.value[id].name === cleanName || items.value[id].gerName === cleanName,
  )

  console.log('result', result)
  return result ?? -1
}

function formatNumber(number: number): string {
  return new Intl.NumberFormat().format(number)
}

function formatSearchList(lang: string): string {
  let text = 'WarEffort'
  if (lang === 'ger')
    Object.keys(items.value).forEach((key) => {
      text += '^"' + items.value[key].gerName + '"'
    })
  else
    Object.keys(items.value).forEach((key) => {
      text += '^"' + items.value[key].name + '"'
    })

  return text
}
</script>

<template>
  <div class="mx-10">
    <div class="grid grid-cols-5">
      <div>Name</div>
      <div class="">Stack-Size</div>
      <div class="">AH-Price per Unit</div>
      <div class="">Price per Effort</div>
      <div>Manuel Work</div>
      <template v-for="(item, index) in items" :key="index">
        <div>{{ item.gerName }}</div>
        <div>{{ item.stackSize }}</div>
        <div><input v-model="item.price" type="number" /></div>
        <div :class="[item.price > 0 ? '' : 'opacity-25']">
          {{ formatNumber((item.price * item.stackSize) / item.amount) }}
        </div>
        <div class="">{{ item.furtherWork ?? 'no' }}</div>
      </template>
    </div>
  </div>
  <div class="mx-10">
    <button class="bg-black cursor-pointer text-white" @click="importValue">Import</button>
    <textarea class="w-full border-solid border-black border-2 h-60" ref="importAH">
'Preis', 'Name', 'Eigene?', 'Spitze?', 'Verfügbar'
7557, 'Runenstoff', '', 'Nein', 642
3481, 'Seidenstoff', '', 'Nein', 563
539, 'Leinenstoff', '', 'Nein', 246
2491, 'Würgetang', '', 'Nein', 130
4744, 'Lila Lotus', '', 'Nein', 429
8985, "Arthas' Tränen", '', 'Nein', 363
717, 'Kupferbarren', '', 'Nein', 122
2992, 'Eisenbarren', '', 'Nein', 740
8745, 'Thoriumbarren', '', 'Nein', 165
973, 'Leichtes Leder', '', 'Nein', 443
3600, 'Mittleres Leder', '', 'Nein', 471
6991, 'Dickes Leder', '', 'Nein', 323
6314688, 'Roher Tüpfelgelbschwanz', '', 'Nein', 1
</textarea
    >
  </div>

  <div class="">
    <p>
      German:
      <br />
      <code class="border-black border-solid border-2">{{ formatSearchList('ger') }} </code>
    </p>
    <p>
      English:
      <br />
      <code class="border-black border-solid border-2">
        {{ formatSearchList('eng') }}
      </code>
    </p>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
