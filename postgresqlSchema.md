create table features(
    id INT PRIMARY KEY,
    product_id INT NOT NULL,
    feature VARCHAR (255),
    value VARCHAR (255)
);
COPY features FROM 'C:\repo\sdc\sdc\features.csv' DELIMITER ',' CSV;
CREATE INDEX idx_features ON features(id);
create table photos(
    _id SERIAL PRIMARY KEY,
    id INT NOT NULL,
    styleId INT NOT NULL,
    url VARCHAR,
    thumbnail_url VARCHAR
);
COPY photos (id, styleId, url, thumbnail_url) FROM 'C:\repo\sdc\sdc\photos.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX idx_photos2 ON photos(styleId);
create table product(
    id INT PRIMARY KEY,
    name VARCHAR (255),
    slogan VARCHAR (255),
    description VARCHAR,
    category VARCHAR (255),
    default_price VARCHAR (255)
);
COPY product FROM 'C:\repo\sdc\sdc\product.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX idx_product ON product(id);
create table skus(
    id INT PRIMARY KEY,
    styleID INT NOT NULL,
    size VARCHAR (255),
    quantity VARCHAR (255)
);
COPY skus FROM 'C:\repo\sdc\sdc\skus.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX idx_skus2 ON skus(styleID);
create table styles(
    id INT PRIMARY KEY,
    productId INT NOT NULL,
    name VARCHAR (255),
    sale_price VARCHAR (255),
    original_price VARCHAR (255),
    default_style VARCHAR (255)
);
COPY styles FROM 'C:\repo\sdc\sdc\styles.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX idx_styles ON styles(id);
