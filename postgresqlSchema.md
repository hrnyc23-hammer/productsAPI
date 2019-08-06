create table styles(
    id INT PRIMARY KEY,
    productid INT NOT NULL,
    name VARCHAR (255),
    sale_price VARCHAR (255),
    original_price VARCHAR( 255),
    default_style VARCHAR (255),
    skus VARCHAR,
    photos VARCHAR
);
COPY styles FROM 'C:\repo\sdc\sdc\allStyles.csv' DELIMITER ',' CSV HEADER;
COPY styles FROM '/home/ubuntu/allStyles.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX idx_styles ON styles(productid);

create table product(
    id INT PRIMARY KEY,
    name VARCHAR (255),
    slogan VARCHAR (255),
    description VARCHAR,
    category VARCHAR (255),
    default_price VARCHAR (255),
    features VARCHAR
);
COPY product FROM 'C:\repo\sdc\sdc\combinedFeatures.csv' DELIMITER ',' CSV HEADER;
COPY product FROM '/home/ubuntu/combinedFeatures.csv' DELIMITER ',' CSV HEADER;
CREATE INDEX idx_product ON product(id);