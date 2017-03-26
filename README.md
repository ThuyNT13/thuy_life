To test out deploying to **AWS** but also just putting together the skeleton of a basic website.

Will eventually add back-end functionality with Rails and [deploy to AWS OpsWorks](https://aws.amazon.com/blogs/developer/deploying-ruby-on-rails-applications-to-aws-opsworks/), and then sync with [Travis CI](https://travis-ci.org/). For now, here are the steps for creating a basic static site with just HTML, CSS and JavaScript.

## Style

No framework, just CSS.

Based off of [W3.CSS templates](https://www.w3schools.com/css/css_rwd_templates.asp) and tweaked to learn how it works. Particularly exploring parallax effect, responsive design and different layouts for the navbar.

- [ ] Major refactoring needed to DRY up code.
- [ ] Adjust height/padding for small screens.
- [ ] Make styles more coherent - simple elegance

## Amazon Web Services (AWS)

First step is to go to [**AWS**](https://aws.amazon.com) and click on the **Create an AWS Account** button. Keep phone nearby as you will need to verify account with a pin that will be sent via text or email.

### Setup IAM User and assign to Administrator Group

When you first signup to **AWS**, you will get a *root user account* so the next step is to create an [**IAM user account**](http://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) that has administrator access. Then you will place that user in an "Administrator" group to which you will attach the *AdministratorAccess* managed policy. You should only operate from the *root user* for [root user specific scenarios](http://docs.aws.amazon.com/general/latest/gr/aws_tasks-that-require-root.html). Outside of those, **always utilize IAM users**.

Once you are signed into AWS, navigate to [AWS IAM Console](https://console.aws.amazon.com/iam/). Follow these steps: [Creating Your First IAM Admin User and Group](http://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html).

After creating your first **IAM user**, it will generate a link to be used for signing into AWS each time, the **sign-in URL**. You can find it by clicking on Dashboard from the navigation pane. This is what it looks like

```
https://MY_ACCOUNT_ID#.signin.aws.amazon.com/console
```

Note that `MY_ACCOUNT_ID#` is your account id. That needlessly exposes account info and it looks terrible. Follow these directions to assign an alias to your account: [Your AWS Account ID and its Alias](http://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html)

Read more about the **sign-in URL**: [How Users Sign In to Your Account](http://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_how-users-sign-in.html)

Sign-out of your *root account* and sign into your newly created *IAM user account* using the **sign-in URL**. The sign-in page has a link to sign-in for *root user* if you need to get there, but everything from here on out should be performed as an *IAM user*.

For added security, setup [**Multi-Factor Authentication**](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html). At the minimum set it up for the *root account* if not also the admin *IAM user*.

### Create Amazon S3 Buckets

[Amazon Simple Storage Service (S3)](https://aws.amazon.com/documentation/s3/) buckets are where you will store the content for uploading website.

What helped me with the process of creating and routing the buckets is understanding the difference between a *root domain* and *subdomains*. The *root domain* (also referred to as *bare/naked domain* or *zone apex*) is the highest level domain for the purpose of setting up a website.

- **my_website.com** is the *root domain*.
- **www.my_website.com** and **blog.my_website.com** are *subdomains* (note that they both have a *dot* separating the prefixed sub-name from the *root domain*).

This will come into play particularly when you start to decide how your blog is setup. There are copious discussions arguing the pros and cons of using subdomain vs subfolder for your blog. Google `blog subdomain vs subfolder`

- **my_website.com/blog** is a *root domain* with a blog subfolder

Keeping this concept clear will also help to avoid deployment issues. In this case, the *subdomain* you will be working with is prefixed by `www.`.

Navigate to [Amazon S3 console](https://console.aws.amazon.com/s3/). Follow step 2 to [create **two buckets**](https://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html#root-domain-walkthrough-s3-tasks), one for the *root domain* and the other for the *subdomain*. You will host content in the *root domain* (the *subdomain* just redirects to the *root domain*), and configure your buckets for website hosting. Note that you only add the bucket policy to the *root domain*.

**Do not** proceed to Step 3.

### Register a domain with Amazon Route 53

Navigate to the [**Amazon Route 53 console**](https://console.aws.amazon.com/route53/)

If you haven't purchased and registered your domain name, yet, follow [Step 1: Register a domain](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/getting-started.html#getting-started-find-domain-name).

**Do not** continue beyond Step 1.

If you have a registered domain from GoDaddy.com, follow these steps to start the process of migrating a domain from DNS Provider, GoDaddy.com, to Amazon Route 53 (enter your *root domain* in the **Domain Name** field): [Creating a Hosted Zone](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/MigratingDNS.html#Step_CreateHostedZone)

This creates four **Name Server (NS)** records and a **Start of Authority (SOA)** record. Make note of the **NS records**.

Login to your GoDaddy account and follow these steps to enter in the **NS records** you just generated: [Set custom nameservers for domains registered with GoDaddy](https://www.godaddy.com/help/set-custom-nameservers-for-domains-registered-with-godaddy-12317).

### Route DNS traffic to S3 buckets

Follow [Step 5: Route DNS Traffic for Your Domain to Your Website Bucke](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/getting-started.html#getting-started-create-alias) and create a **resource record set** for both your *root domain* as well as your *subdomain*. Note that when you are creating the record set for the *subdomain*, enter `www` (no dot) into the **Name** field.

You should now be able to enter both *root* and *subdomain* into web browsers and see your site. Celebrate!

For troubleshooting, I assigned a value of 0 to *TTL (Time To Live)* to clear out the cache so that changes will be more immediate. This is such a small file, it won't be a performance issue. Afterwards, you can go back into Route 53 and change it for production.

## Setup HTTPS

[AWS Certificate Manager](https://aws.amazon.com/documentation/acm/?icmpid=docs_menu_internal) manages and deploys SSL/TLS certificates that will be needed to setup HTTPS.

[CloudFront](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) is a Content Delivery Network (CDN) service that promises to speed up the distribution of your content. But mostly, for this exercise, it allows you to utilize the SSL certificate to setup HTTPS.

### Request a Certificate from AWS Certificate Manager

Navigate to [AWS Certificate Manager Console](https://console.aws.amazon.com/acm/) and make sure the region is set to **U.S. East 1 - N. Virginia**, otherwise, you won't be able to utilize it in **CloudFront**.

Follow these steps to [Request a Certificate](http://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request.html). Add *root domain* and *subdomain* to secure both with the SSL/TSL certificate.
You will also need to [Validate Domain Ownership](http://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate.html).

Once **AWS Certificate** status has changed to *Issued*, you can add the certificate to your CloudFront Distribution.

### Setup Amazon CloudFront Distribution

Navigate to the [**Cloudfront console**](https://console.aws.amazon.com/cloudfront/)

Click on **Create Distribution** button and then under **Web** click the **Get Started** button to select Web as your delivery method.

There are a lot of [Distribution Web Values](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.htm) to consider on this page, but just going to focus on a few.

1. Open up another window or tab and navigate to the [S3 console](https://console.aws.amazon.com/s3/).

2. Select your *root domain* bucket. Click on **Properties** tab, click on **Static Website Hosting** and copy the **Endpoint url**.

3. Back in the CloudFront Distribution window, paste this **Endpoint url** as the value for [Origin Domain Name](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesDomainName).

4. Under [Viewer Protocol Policy](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesViewerProtocolPolicy), you want to select **Redirect HTTP to HTTPS**.

5. Click the **Yes** button for [Compress Objects Automatically](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesCompressObjectsAutomatically).

6. Set *root domain* as the value for [Alternate Domain Names (CNAMEs)](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesCNAME).

7. Under [SSL Certificate](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesSSLCertificate), you should now be able to click the **Custom SSL Certificate** radio button and select the certificate you just created from the dropdown menu. If not, [trouble shoot](http://docs.aws.amazon.com/acm/latest/userguide/troubleshooting.html) and then come back here to try and set certificate again.

8. Set `index.html` as the value for [Default Root Object](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesDefaultRootObject). If you are creating a CloudFront Distribution for *subdomain*, you do not set this as there is no index.html file in your subdomain bucket.

9. Click **Create Distribution** button to save your selections.

10. Repeat steps 1-9, skipping 8, and create a separate CloudFront Distribution for your *subdomain*. Substitute *subdomain* for wherever you see *root domain*.

Now is a good time to go for a long walk as it might take awhile for the process to complete.

Or you could read AWS' guide to [Task List for Creating a Web Distribution](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-creating.html) or [Values that You Specify When You Create or Update a Web Distribution](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html). There are many more options to explore.

## Route to CloudFront

Navigate back to the [**Amazon Route 53 console**](https://console.aws.amazon.com/route53/) and select the Hosted Zone you created for your domain.

Select the *root domain* Alias Record Set and in the **Alias Target** field, delete the present value, which should currently be the S3 bucket. Then from the dropdown menu, click the CloudFront Distribution just created. Click **Create** button. Repeat steps for *subdomain*.

If all went well, you should now have a secure static website deployed to AWS. Congrats!

---

### REFERENCES

- [Setting Up a GoDaddy Domain Name With Amazon Web Services](http://www.mycowsworld.com/blog/2013/07/29/setting-up-a-godaddy-domain-name-with-amazon-web-services/)
- [Host a Static Site on AWS, using S3 and CloudFront](https://www.davidbaumgold.com/tutorials/host-static-site-aws-s3-cloudfront/)


## Support

Please open or respond to [an issue](https://github.com/ThuyNT13/thuy_life/issues) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and open a [pull request](https://github.com/ThuyNT13/thuy_life/pulls). Don't push to master.
