aws s3api create-bucket --bucket v2-cougar-web-farm-poly --region ap-southeast-1  --create-bucket-configuration LocationConstraint=ap-southeast-1

aws s3api put-bucket-policy --bucket v2-cougar-web-farm-poly --policy file://./deployment/bucket_policy_web_farm_v2_poly.json

aws s3 sync './build' s3://v2-cougar-web-farm-poly/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers --delete --exclude '.git/*' --exclude '.vscode/*' --exclude 'package.json'

aws s3 website s3://v2-cougar-web-farm-poly/ --index-document index.html --error-document index.html

aws cloudfront create-invalidation --distribution-id E2B9XWCCUK6LWQ --paths "/*"