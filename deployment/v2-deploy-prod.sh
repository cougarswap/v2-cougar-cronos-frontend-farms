aws s3 sync './build' s3://v2-cougar-web-farm-poly/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers --delete --exclude '.git/*' --exclude '.vscode/*' --exclude 'package.json'

aws cloudfront create-invalidation --distribution-id E2B9XWCCUK6LWQ --paths "/*"