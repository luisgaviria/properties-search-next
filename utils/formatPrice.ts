export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  export const checkNumberNine = (number: number) => {
    const digitCount = Array.from(String(number)).reduce((count, digit)=> {
      count[digit] = (count[digit] || 0) + 1;
      return count;
    }, {});
  
    if (digitCount["9"] === String(number).length) {
      return 0;
    }
  
    return number;
  };
  