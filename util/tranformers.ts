const Transformers = (key: string, value: any) => {
  switch (key) {
    case "size":
      return value.map();
  }
};
