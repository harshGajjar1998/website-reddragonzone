/**
 * Mobile Figma frames are 390px wide (a few are 394). `cq(px)` converts a design pixel
 * value into container-query width units of the surrounding `mobile-frame`, so absolutely
 * positioned art keeps the design's proportions at any phone width.
 */
export const cq = (px: number, frame = 390) => `${+((px / frame) * 100).toFixed(3)}cqw`;
