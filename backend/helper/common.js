function getNameAbbreviation(name) {
    const words = name.split(' ');
  
    const initials = words.length > 1 ? words.slice(0, 2).map(word => word.charAt(0).toUpperCase()) : name.length >= 2 ? [name.charAt(0).toUpperCase(), name.charAt(1).toUpperCase()] : [name.charAt(0).toUpperCase()];
    return initials.join('');
}

export default {
    getNameAbbreviation
}