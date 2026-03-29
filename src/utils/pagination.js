//Helper para estandarizar paginado

export const getPagination = (pageQuery, limitQuery) => {
    const page = parseInt(pageQuery) || 1;
    const limit = parseInt(limitQuery) || 10;
    const skip = (page - 1) * limit;
    
    return { page, limit, skip };
}