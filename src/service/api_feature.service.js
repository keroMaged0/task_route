
export class ApiFeature {
    constructor(searchQuery, mongooseQuery) {
        this.searchQuery = searchQuery,
            this.mongooseQuery = mongooseQuery
    }

    //=================================== pagination ===================================//
    pagination() {
        // if not send value in query or less than one
        if (this.searchQuery.page < 1) this.searchQuery.page = 1

        // create page number
        let pageNumber = this.searchQuery.page * 1 || 1

        // create page limit
        let pageLimit = 3
        this.pageNumber = pageNumber

        // create skip 
        let skip = (pageNumber - 1) * pageLimit
        this.mongooseQuery.skip(skip).limit(pageLimit)
        return this
    }

    //=================================== sorting ===================================//
    sorting(sort) {
        // if not send value in query 
        if (!sort) {
            // sort on createdAt desc
            this.mongooseQuery = this.mongooseQuery.sort({ createdAt: -1 })
            return this
        }

        const key = sort.split(':')[0]
        const value = sort.split(':')[1]

        // replace vale in query
        let formula = JSON.parse(value.replace(/desc/g, -1).replace(/asc/g, 1).replace(/ /g, ':'))

        this.mongooseQuery = this.mongooseQuery.sort({ [key]: +formula })
        return this
    }

}