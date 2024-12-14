<script setup lang="ts">
import { ref } from 'vue'
import { itemsList } from '@/composables/itemList'

const items = ref(itemsList)
const importAH = ref(
  `"Preis","Name","Eigene?","Spitze?","Verfügbar"
434,"Leichtes Leder","","Nein",168
3399,"Mittleres Leder","","Nein",568
2738,"Würgetang","","Nein",332
9258,"Dickes Leder","","Nein",308
1400,"Seidenstoff","","Nein",539
5581,"Roher Tüpfelgelbschwanz","","Nein",64
3307,"Seidenverband","","Nein",266
5088,"Lila Lotus","","Nein",392
6496,"Arthas' Tränen","","Nein",227
8457,"Thoriumerz","","Nein",144
10293,"Thoriumbarren","","Nein",522
2661,"Runenstoff","","Nein",95
9998,"Runenstoffverband","","Nein",840`,
)

function importValue() {
  const text = importAH.value
  const rows = text?.split(/\r?\n/)
  const cleanRows = rows?.filter((row) => findItem(row.split(',')[1]) > 0)
  console.log(cleanRows)

  cleanRows?.forEach((row) => {
    const cols = row.split(',')
    const id = findItem(cols[1])
    items.value[id].price = Number.parseInt(cols[0])
  })
}

function findItem(name: string): number {
  if (name === undefined) return -1
  const cleanName = name.slice(1, -1)
  console.log(cleanName)
  const result = Object.keys(items.value).find(
    (id) => items.value[id].name === cleanName || items.value[id].gerName === cleanName,
  )

  console.log('result', result)
  return result ?? -1
}

function formatNumber(number: number): string {
  return new Intl.NumberFormat().format(Number.parseInt(number))
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
      <div class="text-white">Name</div>
      <div class="text-white">Stack-Size</div>
      <div class="text-white">AH-Price per Unit</div>
      <div class="text-white">Price per Effort</div>
      <div class="text-white">Manuel Work</div>
      <template v-for="(item, index) in items" :key="index">
        <div class="text-white">{{ item.gerName }}</div>
        <div class="text-white">{{ item.stackSize }}</div>
        <div class="">
          <input v-model="item.price" type="number" class="bg-gray-300" />
        </div>
        <div class="text-white" :class="[item.price > 0 ? '' : 'opacity-25']">
          {{ formatNumber((item.price * item.stackSize) / item.amount) }}
        </div>
        <div class="text-white">{{ item.furtherWork ?? 'no' }}</div>
      </template>
    </div>
  </div>
  <div class="mx-10">
    <button class="bg-black cursor-pointer text-white rounded-md" @click="importValue">
      Import
    </button>
    <textarea class="w-full border-solid border-black border-2 h-60 bg-gray-300" v-model="importAH">
    </textarea>
  </div>

  <div class="mx-10 text-white">
    <p>
      German:
      <br />
      <code class="border-black border-solid border-2 rounded-md"
        >{{ formatSearchList('ger') }}
      </code>
    </p>
    <p>
      English:
      <br />
      <code class="border-black border-solid border-2 rounded-md">
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
