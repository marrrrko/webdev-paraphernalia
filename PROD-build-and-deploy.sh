#!/bin/bash

export AWS_PROFILE=default
npm run build
aws s3 cp ./dist/ s3://webdev-paraphernalia.markcarrier.info/ --recursive
aws cloudfront create-invalidation --distribution-id E3IN7ZSZ9MRSJO --paths '/*'
