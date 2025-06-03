
export const CHART_COLORS = (index) => {
    const colors = [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)',
        'rgb(128,0,0)',
        'rgb(0,0,128)',
        'rgb(0,100,0)'

    ]
    if (index >= 10) {
        const randomNumber = Math.floor(Math.random() * (9 - 1 + 1) + 1)
        return colors[index - randomNumber];

    } else {
        return colors[index];

    }
};
export const transparentize = (rgb, alpha) => {
    const rgbArray = rgb.replace(/[^\d,]/g, '').split(',');
    const r = rgbArray[0];
    const g = rgbArray[1];
    const b = rgbArray[2];

    const a = (1 - alpha) * 255;
    const calc = x => Math.round((x - a) / alpha);

    return `rgba(${calc(r)}, ${calc(g)}, ${calc(b)}, ${alpha})`;

};
