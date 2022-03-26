const useBusinessList = (businesslist) => {
    const businessCreatorRequest = businesslist.filter(business => (business.requestOpen === true) && (business.activeBusiness === true))
    const businessVenues = businesslist.filter(business => (business.businesstype === 'venue') || (business.businesstype === 'both'))
    const businessBrands = businesslist.filter(business => business.businesstype === 'brand')

    return { businessCreatorRequest, businessVenues, businessBrands }
}

export default useBusinessList;