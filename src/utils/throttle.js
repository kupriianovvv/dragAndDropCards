export const rafThrottle = fn => {
  let rafId = null;

  const throttledFn = (...args) => {
    if (typeof rafId === 'number') {
      return;
    }

    rafId = requestAnimationFrame(() => {
      fn.apply(null, args);
      rafId = null;
    });
  };

  throttledFn.cancel = () => {
    if (typeof rafId !== 'number') {
      return;
    }

    cancelAnimationFrame(rafId);
  };

  return throttledFn;
};

/*вроде кансел не нужен, ты один раз создаешь троттлинговую функцию
она ничего не будет делать, если раф айди не налл,
а наллом он становится когда коллбек внутри рафа срабатывает*/