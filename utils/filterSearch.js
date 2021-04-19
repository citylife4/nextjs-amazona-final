export const filterSearch = ({router, page, category, brand,order,min,max, search,price,rating,city,subcategory,department}) => {
    const path = router.pathname;
    const query = router.query;
    if(department) query.department= department;
    if(category) query.category = category;
    if(subcategory) query.subcategory = subcategory;
    if(brand) query.brand= brand;
    if(page) query.page = page;
    if(search) query.search = search;
    if(order) query.order = order;
    if(price) query.price = price;
    if(rating) query.rating = rating;
    if(min ) query.min ? query.min : query.min === 0 ? 0 : min;
    if(max) query.max ? query.max : query.max === 0 ? 0 : max;
    if(city) query.city = city;

    router.push({
        pathname: path,
        query: query
    })
}