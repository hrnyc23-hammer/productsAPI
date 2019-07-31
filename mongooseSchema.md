const infoModel = mongoose.model('info', mongoose.Schema({ 
    id: Number,
    name: String,
    slogan: String,
    description: String,
    category: String,
    default_price: String
     }));

const infoFeaturesModel = mongoose.model('infoFeatures', mongoose.Schema({ 
    id: Number,
    feature: String,
    value: String
     }));

const stylesModel = mongoose.model('styles', mongoose.Schema({ 
    product_id: String,
    style_id: Number,
    name: String,
    original_price: String,
    sale_price: String,
    default: Number,
    photos: Array
    skus: Object
     }));