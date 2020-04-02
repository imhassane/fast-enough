<template>
  <div>
    <div v-if="quote">
      <p v-if="currentTry >= maxTry" class="uk-alert uk-alert-info">
        You have finished the test
      </p>
      <p v-if="currentTry < maxTry">
        <strong>Try: {{ currentTry + 1 }} / {{ maxTry }}</strong>
      </p>
      <p v-if="currentTry < maxTry">{{ quote.text }}</p>
      <hr />
      <input
        v-if="currentTry < maxTry"
        type="text"
        class="uk-input"
        v-model="entry"
        @input="onInput"
        autofocus
      />
      <div v-if="endTyping">
        <p style="color: green;">{{ quote.text }}</p>
        <p>
          <span class="uk-text-danger"
            >{{ results[currentTry].errors.length }} errors</span
          >
        </p>
      </div>
      <button
        v-if="testEnded"
        class="uk-button uk-button-primary uk-margin-small"
        @click="onNext"
      >
        Next
      </button>
      <button @click="onSave" class="uk-button uk-button-primary" v-else>
        Next
      </button>
    </div>
    <div v-else>
      <p>Loading an inspiring quote</p>
    </div>
  </div>
</template>

<script>
import data from "@/assets/quotes.json";

export default {
  name: "test",
  data: () => ({
    maxTry: 1,
    testEnded: false,
    ids: [],
    quotes: [],
    quote: null,
    results: [],
    timings: [],
    currentTry: 0,
    endTyping: false,
    entry: null
  }),
  methods: {
    getRandomQuote() {
      this.endTyping = false;
      this.entry = null;
      let id = parseInt(Math.random() * data.length);
      while (this.ids.includes(id)) id = parseInt(Math.random() * data.length);
      this.ids.push(id);
      this.quote = data[id];
      this.quotes.push(this.quote);
    },
    onInputStart() {
      const start = new Date();
      const timing = { start, end: null };
      this.timings.push(timing);
      this.results.push({ errors: [] });
      this.endTyping = false;
    },
    onInputEnd() {
      const end = new Date();
      this.timings[this.currentTry].end = end;
      this.endTyping = true;
    },
    onInput(event) {
      const { value } = event.target;
      const index = value.length - 1;
      if (index === 0) this.onInputStart();
      if (value[index] !== this.quote.text[index]) {
        this.results[this.currentTry].errors.push(index);
      }
      if (value === this.quote.text) this.onInputEnd();
    },
    onSave() {
      sessionStorage.setItem(
        "x-fast-enough-test-result",
        JSON.stringify(this.resumeTestResult())
      );
      this.$router.push("/results");
    },
    onNext() {
      if (this.currentTry < this.maxTry) {
        this.getRandomQuote();
        this.currentTry++;
      } else {
        this.testEnded = true;
      }
    },
    resumeTestResult() {
      const result = {
        quotes: this.quotes,
        results: this.results,
        timings: this.timings
      };

      return result;
    }
  },
  mounted() {
    this.getRandomQuote();
  }
};
</script>
