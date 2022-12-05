export function paging_component(results, count, page) {
    if (count && page) {
      const pager = [];

      const start = count * page - count;

      let i = 1;

      const cashed_products = results;

      while (cashed_products.length) {
        const r = cashed_products.shift();

        if (i > start) {
          pager.push(r);
        }

        if (i >= start + count) {
          return pager;
        }

        i++;
      }
    }

    return results;
  }