#!/usr/bin/env sh
set -e

# integration-testing
[ -z "$1" ] && >&2 echo "Usage: $0 <environment>" && exit 1

ENV=$1
>&2 echo "ENV: ${ENV}"

set | grep -v AWS_REGION | sort > ./.tmp.start.env-vars

### ------------------------------------------------------------------------------ ###

SCRIPT_PUBLIC_URL=$(cat public-urls/${ENV})

[ $ENV != "prod" ] && SCRIPT_PROD_PUBLIC_URL=$(cat public-urls/prod)

>&2 echo "done SCRIPT_PUBLIC_URL: ${SCRIPT_PUBLIC_URL}"
### ------------------------------------------------------------------------------ ###

STATIC_HOSTNAME=$(cat public-urls/staticHostname)
>&2 echo "done STATIC_HOSTNAME: ${STATIC_HOSTNAME}"
### ------------------------------------------------------------------------------ ###



AWS_REGION=$( aws configure list | grep region | awk '{print $2}')
>&2 echo "done AWS_REGION: ${AWS_REGION}"
### ------------------------------------------------------------------------------ ###

AWS_SQS_QUEUE_URL=$(
   aws sqs get-queue-url --queue-name=realtime-changes-${ENV}-changes-queue --output text --query QueueUrl
)
>&2 echo "done AWS_SQS_QUEUE_URL: ${AWS_SQS_QUEUE_URL}"
### ------------------------------------------------------------------------------ ###



PRODUCER_AWS_ACCESS_KEY_ID=$(
  aws iam list-access-keys --user-name=realtime-changes-${ENV}-producer --output text --query AccessKeyMetadata\[-1\].AccessKeyId
)
>&2 echo "done PRODUCER_AWS_ACCESS_KEY_ID: ${PRODUCER_AWS_ACCESS_KEY_ID}"
### ------------------------------------------------------------------------------ ###



PRODUCER_AWS_SECRET_ACCESS_KEY=$(
  aws ssm get-parameter --name /realtime-changes-${ENV}-producer-user/secret --output text --query Parameter.Value
)
>&2 echo "::add-mask::$PRODUCER_AWS_SECRET_ACCESS_KEY"
>&2 echo "done PRODUCER_AWS_SECRET_ACCESS_KEY: $PRODUCER_AWS_SECRET_ACCESS_KEY..."
### ------------------------------------------------------------------------------ ###




CONSUMER_AWS_ACCESS_KEY_ID=$(
  aws iam list-access-keys --user-name=realtime-changes-${ENV}-consumer --output text --query AccessKeyMetadata\[-1\].AccessKeyId
)
>&2 echo "done CONSUMER_AWS_ACCESS_KEY_ID: ${CONSUMER_AWS_ACCESS_KEY_ID}"
### ------------------------------------------------------------------------------ ###



CONSUMER_AWS_SECRET_ACCESS_KEY=$(
   aws ssm get-parameter --name /realtime-changes-${ENV}-consumer-user/secret --output text --query Parameter.Value
)
>&2 echo "::add-mask::$CONSUMER_AWS_SECRET_ACCESS_KEY"
>&2 echo "done CONSUMER_AWS_SECRET_ACCESS_KEY: $CONSUMER_AWS_SECRET_ACCESS_KEY..."
### ------------------------------------------------------------------------------ ###



set | sort > ./.tmp.finish.env-vars

comm -13 ./.tmp.start.env-vars ./.tmp.finish.env-vars | grep -v "^_="

rm ./.tmp.start.env-vars ./.tmp.finish.env-vars
