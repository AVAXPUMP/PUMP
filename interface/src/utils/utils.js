export function short_address(address) {
    return address.substr(0, 6) + '...' + address.substr(-4)
}

// Helper function to validate URLs
export function isValidUrl(string) {
    const res = string.match(/(https?:\/\/[^\s]+)/g);
    return (res !== null);
}

export function timeAgo(isoString) {
    const time = new Date(isoString);
    const now = new Date();
    const diff = now - time;

    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay; // Approximation for a month
    const oneYear = 365 * oneDay; // Approximation for a year

    if (diff < oneMinute) {
        return "just now";
    } else if (diff < oneHour) {
        const minutes = Math.floor(diff / oneMinute);
        return `${minutes}min${minutes === 1 ? '' : ''} ago`;
    } else if (diff < oneDay) {
        const hours = Math.floor(diff / oneHour);
        return `${hours}h${hours === 1 ? '' : ''} ago`;
    } else if (diff < oneWeek) {
        const days = Math.floor(diff / oneDay);
        return `${days}d${days === 1 ? '' : ''} ago`;
    } else if (diff < oneMonth) {
        const weeks = Math.floor(diff / oneWeek);
        return weeks === 1 ? "1w ago" : `${weeks}w ago`;
    } else if (diff < oneYear) {
        const months = Math.floor(diff / oneMonth);
        return `${months}m${months === 1 ? '' : ''} ago`;
    } else {
        const years = Math.floor(diff / oneYear);
        return `${years}y${years === 1 ? '' : ''} ago`;
    }
}

export function formatNumber(num) {
    if (typeof num !== 'number') {
        return 'Invalid input';
    }

    // 去掉小数部分
    num = Math.floor(num);

    // 格式化数字
    if (num >= 1000000) {
        return (num / 1000000).toFixed(0) + 'm'; // 百万
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'k'; // 千
    } else {
        return num.toString(); // 小于千的数字直接返回
    }
}
