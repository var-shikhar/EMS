function getNameAbbreviation(name) {
    const words = name.split(' ');
  
    const initials = words.length > 1 ? words.slice(0, 2).map(word => word.charAt(0).toUpperCase()) : name.length >= 2 ? [name.charAt(0).toUpperCase(), name.charAt(1).toUpperCase()] : [name.charAt(0).toUpperCase()];
    return initials.join('');
}

const generateUniqueID = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };
  
export default {
    getNameAbbreviation,
    generateUniqueID
}