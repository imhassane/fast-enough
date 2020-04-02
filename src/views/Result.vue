<template>
  <div>
    <div v-if="error">
      <p class="uk-alert uk-alert-danger">{{ error }}</p>
      <p>
        <router-link to="/test" class="uk-button uk-button-primary"
          >Take a test</router-link
        >
      </p>
    </div>
    <div v-else-if="result === null">
      <p>Loading...</p>
    </div>
    <div v-else>
      <p>Results</p>
      <hr />
      <table class="uk-table uk-table-divider">
        <thead>
          <th>round</th>
          <th>quote</th>
          <th>errors / %</th>
          <th>timing / words per min</th>
        </thead>
        <tbody>
          <tr v-for="(r, index) in result.quotes" :key="index">
            <td>{{ index + 1 }}</td>
            <td style="text-align: left;">{{ r.text }}</td>
            <td class="uk-text-meta">
              {{ countErrors(index) }} /
              <span class="uk-label"
                >{{
                  Math.floor(100 - (countErrors(index) * 100) / r.text.length)
                }}%</span
              >
            </td>
            <td class="uk-text-meta">
              {{ timeDiff(index) }} s /
              <span class="uk-label">
                {{ Math.floor((60 * r.text.length) / timeDiff(index)) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="uk-grid uk-flex-center">
      <div>
        <p>
          Total characters typed:
          <span class="uk-label">{{ quotesCount }}</span>
        </p>
      </div>
      <div>
        <p>
          Precision: <span class="uk-label">{{ errorsCount }}</span>
        </p>
      </div>
      <div>
        <p>
          Words per minute: <span class="uk-label">{{ timingAvg }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "result",
  data: () => ({ result: null, error: null, id: 0 }),
  methods: {
    timeDiff(index) {
      const times = this.result.timings[index];
      let { start, end } = times;
      start = new Date(start);
      end = new Date(end);
      const diff = (end.getTime() - start.getTime()) / 1000;
      return diff;
    },
    countErrors(id) {
      return this.result.results[id].errors.length;
    },
    getResults() {
      let errorsCount = 0;
      let timingAvg = 0;
      let quotesCount = 0;

      this.result.results.map(r => (errorsCount += r.errors.length));
      this.result.timings.map((t, i) => (timingAvg += this.timeDiff(i)));
      this.result.quotes.map(q => (quotesCount += q.text.length));

      errorsCount = Math.floor(100 - (errorsCount * 100) / quotesCount);
      timingAvg = Math.floor((60 * quotesCount) / timingAvg);
      return { errorsCount, timingAvg, quotesCount };
    }
  },
  computed: {
    errorsCount() {
      return this.getResults().errorsCount;
    },
    quotesCount() {
      return this.getResults().quotesCount;
    },
    timingAvg() {
      return this.getResults().timingAvg;
    }
  },
  mounted() {
    const data = sessionStorage.getItem("x-fast-enough-test-result");
    if (data === null || data === undefined) {
      this.error = "You haven't taken a test yet";
    } else {
      this.result = JSON.parse(data);
    }
  }
};
</script>
