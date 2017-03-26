To test out deploying to **AWS** but also just getting the skeleton of a basic website together for reference.

## Style

Based off of [W3.CSS templates](https://www.w3schools.com/css/css_rwd_templates.asp). I tweaked to learn how it works and to make it my own, particularly exploring parallax effect, responsive design and different layouts for the navbar.

Major refactoring needed to DRY up code.

## Amazon Web Services (AWS)

Will eventually add back-end functionality with Rails and [deploy to AWS OpsWorks](https://aws.amazon.com/blogs/developer/deploying-ruby-on-rails-applications-to-aws-opsworks/).

For now, here are the notes for **Creating a Basic Static Site with S3, Route 53 and CloudFront**.

First step is to go to [**AWS**](https://aws.amazon.com) and click on the **Create an AWS Account** button. Keep phone nearby as you will need to verify account with a pin that will be sent via text or email.

### Setup IAM User and assign to Administrator Group

When you first signup to **AWS**, you will get a *root user account* so the next step is to create an *IAM user account* that has administrator access. Then you will place that user in an "Administrator" group to which you will attach the *AdministratorAccess* managed policy. For the sake of security, you should only operate from the *root user* for [root user specific scenarios](http://docs.aws.amazon.com/general/latest/gr/aws_tasks-that-require-root.html). Outside of those, **always utilize** [**IAM**](http://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) **users**.

Once you are signed into AWS, navigate to [AWS IAM Console](https://console.aws.amazon.com/iam/). Follow these steps: [Creating Your First IAM Admin User and Group](http://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html)

Make note of the **IAM users sign-in URL** which looks like
```
https://MY_ACCOUNT_ID#.signin.aws.amazon.com/console
```

You can find it by clicking on Dashboard from the navigation pane. This is the link to be used for signing into AWS each time.

Note that `MY_ACCOUNT_ID#` is your account id. That exposes your account info and it looks terrible. Follow these directions to assign an alias to your account: [Your AWS Account ID and its Alias](http://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html)

Read more about the **sign-in URL**: [How Users Sign In to Your Account](http://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_how-users-sign-in.html)

Sign-out of your *root account* and sign into your newly created *IAM user account* using the **sign-in URL**. Note that the sign-in page has a link to sign-in for *root user* if you need to get there, but everything from here on out should be performed as an *IAM user*.

For added security, setup [**Multi-Factor Authentication**](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html). At the minimum set it up for the *root account* if not also the admin *IAM user*.

### Create Amazon S3 Buckets

Firstly, understand the difference between your *root domain* and your *subdomains*. The *root domain* (also referred to as *bare/naked domain* or *zone apex*) is the highest level domain for the purpose of setting up a website.

- **my_website.com** is the *root domain*.
- **www.my_website.com** and **blog.my_website.com** are *subdomains* (note that they both have a *dot* separating the sub-name from the *root domain*).

This will come into play particularly when you start to decide how your blog is setup. There are copious discussions arguing the pros and cons of subdomain vs subfolder. Google `blog subdomain vs subfolder`

- **my_website.com/blog** is a *root domain* with a blog subfolder

Keeping this concept clear will also help to avoid deployment issues.

Navigate to [Amazon S3 console](https://console.aws.amazon.com/s3/). Follow step 2 to [create **two buckets**](https://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html#root-domain-walkthrough-s3-tasks), one for the *root domain* and the other for the *subdomain* prefixed by `www.` You will host content in the *root domain* (the *subdomain* just redirects to the *root domain*), and configure your buckets for website hosting. Note that you only add the bucket policy to the *root domain*.

**Do not** proceed to Step 3.

---
### Amazon Route 53 Register a domain

Navigate to the [**Amazon Route 53 console**](https://console.aws.amazon.com/route53/)

If you haven't purchased and registered your domain name, yet, follow [Step 1: Register a domain](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/getting-started.html#getting-started-find-domain-name). Do not continue beyond Step 1.

---

If you have a registered domain from GoDaddy.com, follow these steps to start the process of migrating a domain from DNS Provider, GoDaddy.com, to Amazon Route 53 (Note, enter your *root name* in the **Domain Name** field): [Creating a Hosted Zone](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/MigratingDNS.html#Step_CreateHostedZone)

This creates four **Name Server (NS) records** and a Start of Authority (SOA) record. Make note of the NS records.

Login to your GoDaddy account and follow these steps [Set custom nameservers for domains registered with GoDaddy](https://www.godaddy.com/help/set-custom-nameservers-for-domains-registered-with-godaddy-12317) and enter in the NS records you just generated.

---
### Route DNS traffic to S3 buckets

Do [Step 5: Route DNS Traffic for Your Domain to Your Website Bucke](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/getting-started.html#getting-started-create-alias) to create a **resource record set** for both your *root domain* as well as your *subdomain*. Note that you need to append `www` to your *subdomain*, so when creating the record set for subdomain, enter `www` (no dot) into the **Name** field.

---

These are the basic steps to deploy a static website to AWS. Will post steps for setting up a secure HTTPS for your website, soon.

---

### REFERENCES

- [Setting Up a GoDaddy Domain Name With Amazon Web Services](http://www.mycowsworld.com/blog/2013/07/29/setting-up-a-godaddy-domain-name-with-amazon-web-services/)
- [Host a Static Site on AWS, using S3 and CloudFront](https://www.davidbaumgold.com/tutorials/host-static-site-aws-s3-cloudfront/)


## Support

Please open or respond to [an issue](https://github.com/ThuyNT13/thuy_life/issues) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and open a [pull request](https://github.com/ThuyNT13/thuy_life/pulls). Don't push to master.
