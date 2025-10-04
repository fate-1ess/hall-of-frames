export const generateSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

export const findProductBySlug = (products, slug) => {
  return products.find((product) => generateSlug(product.name) === slug);
};

export const findArticleBySlug = (articles, slug) => {
  return articles.find((article) => generateSlug(article.title) === slug);
};

export const getRelatedProducts = (products, product, limit = 4) => {
  if (!product) return [];

  const otherProducts = products.filter((p) => p.id !== product.id);
  const sameCategory = otherProducts.filter((p) => p.category === product.category);
  const sameFileType = otherProducts.filter(
    (p) => p.fileType === product.fileType && p.category !== product.category,
  );
  const sameDesigner = otherProducts.filter(
    (p) => p.designer === product.designer && p.category !== product.category,
  );

  const selectedProducts = [];
  const addUnique = (candidate) => {
    if (!candidate) return;
    if (!selectedProducts.some((item) => item.id === candidate.id)) {
      selectedProducts.push(candidate);
    }
  };

  const seed = Number.parseInt(product.id, 10) || 0;

  if (sameCategory.length > 0) {
    const catIndex = seed % sameCategory.length;
    addUnique(sameCategory[catIndex]);

    if (selectedProducts.length < limit && sameCategory.length > 1) {
      const catIndex2 = (seed + 1) % sameCategory.length;
      addUnique(sameCategory[catIndex2]);
    }
  }

  if (selectedProducts.length < limit && sameFileType.length > 0) {
    const fileTypeIndex = seed % sameFileType.length;
    addUnique(sameFileType[fileTypeIndex]);
  }

  if (selectedProducts.length < limit && sameDesigner.length > 0) {
    const designerIndex = seed % sameDesigner.length;
    addUnique(sameDesigner[designerIndex]);
  }

  if (selectedProducts.length < limit) {
    const remaining = otherProducts.filter(
      (candidate) => !selectedProducts.some((item) => item.id === candidate.id),
    );

    remaining.sort((a, b) => {
      const scoreA = ((Number.parseInt(a.id, 10) || 0) * seed) % 100;
      const scoreB = ((Number.parseInt(b.id, 10) || 0) * seed) % 100;
      return scoreB - scoreA;
    });

    selectedProducts.push(...remaining.slice(0, Math.max(0, limit - selectedProducts.length)));
  }

  return selectedProducts.slice(0, limit);
};
