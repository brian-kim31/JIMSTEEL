"""Load the content from the original jimsteelgarages.co.uk website.

Run:  python manage.py seed_content           (skips if content already exists)
      python manage.py seed_content --reset   (wipes content tables and reloads)
"""
from decimal import Decimal
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand
from django.db import transaction

from content import models as m

SEED = Path(__file__).resolve().parents[2] / "seed"


def attach(instance, field, filename):
    with open(SEED / filename, "rb") as fh:
        getattr(instance, field).save(filename, File(fh), save=False)


SERVICES = [
    {
        "slug": "servicing", "title": "Servicing", "icon": "wrench", "price_from": "100.42",
        "headline": "Service packages and options",
        "summary": "Silver, Gold and Gold Plus service packages built to manufacturer specification "
                   "– your warranty stays intact.",
        "packages": [
            {"name": "Silver Service", "price": "100.42",
             "description": "By changing your engine oil regularly it will help reduce the build up of carbon "
                            "deposits within the engine. Your engine could benefit from longer life, enhanced "
                            "performance and increased fuel economy.",
             "includes": "System flush\nScreen wash\nConsumables",
             "note": "Engine oil & filter are added at an additional price."},
            {"name": "Gold Service", "price": "139.45", "is_featured": True,
             "description": "If you are a driver that covers a lot of miles each year, sometimes a Full Service "
                            "just isn't enough. That is where our Interim Service is beneficial to maintaining "
                            "your vehicle between Full Services.",
             "includes": "System flush\nScreen wash\nConsumables",
             "note": "Engine oil, oil filter & pollen filter are added at an additional price."},
            {"name": "Gold Service Plus", "price": "171.48",
             "description": "Our most comprehensive service option.",
             "includes": "System flush\nScreen wash\nConsumables",
             "note": "Engine oil & filter, air & fuel filters are added at an additional price."},
        ],
        "sections": [
            {"heading": "Keeping it simple",
             "body": "Here at Jim Steel's, we like to keep it simple for our customers when selecting a service "
                     "option.\n\nChoose between our Full Service & Minor Service (Intermediate). Whilst it may be "
                     "a recommendation to opt for a minor service if you are on low yearly mileage, it is always "
                     "worth taking our full-service option as on this service, we remove the road wheels to fully "
                     "inspect the vehicle's braking system.\n\nEvery service conducted at Jim Steel's includes an "
                     "Oil Flush cleaner through the system before renewing the engine oil. Why put new oil into a "
                     "dirty engine!"},
            {"heading": "Please note", "style": "callout",
             "body": "With all our services the price on your booking confirmation is excluding service filters "
                     "& engine oil. These will be added at an additional cost. For an itemised estimate, use our "
                     "contact form and a member of staff will come back to you."},
            {"heading": "What is a brake fluid change?",
             "body": "A brake fluid change is different to a top up, as it involves 'bleeding' your brakes to "
                     "remove the old fluid. You should trust a skilled mechanic to do this job for you, as they "
                     "can also dispose of the old brake fluid and test your braking system for you.\n\n"
                     "The mechanic will replace the old fluid with new, clean brake fluid. A brake fluid change "
                     "also includes a minor diagnostic check to ensure that your electronic ABS system bleeds the "
                     "brakes correctly. It removes every single drop of fluid from the system.\n\n"
                     "Many brake fluid replacements include a visual brake check, and many mechanics use a "
                     "pressure bleeder system. This pumps new fluid through the system under pressure and the old "
                     "fluid out of the system.\n\nSpecialist equipment is used to bleed your brakes to get rid of "
                     "any vapour bubbles that may be lodged in them. Add this option when you book or when you "
                     "drop your vehicle off."},
            {"heading": "Mix and match", "style": "tip",
             "body": "Many of our customers like to alternate between Minor & Full Services & have the brake fluid "
                     "replaced with the minor service to even out prices. Some of our customers do plenty of "
                     "mileage, so opt for the full service every year and add the brake fluid every two years."},
        ],
    },
    {
        "slug": "mot", "title": "MOTs", "icon": "clipboard-check", "price_from": "48.00",
        "headline": "Licensed Class 4 MOT testing station",
        "summary": "Class 4 MOT testing for petrol and diesel vehicles, with free retests when we carry out "
                   "the repairs.",
        "packages": [
            {"name": "Class 4 MOT", "price": "48.00", "is_featured": True,
             "includes": "Petrol & diesel vehicles\nReminders before your renewal date\nFree retest when repairs "
                         "are done on site"},
        ],
        "sections": [
            {"heading": "No pre-tests, no fuss",
             "body": "We can test petrol and diesel vehicles. We don't carry out 'pre-tests' – instead we simply "
                     "fix small items at the end of the MOT so that we can issue your pass without delaying you, "
                     "charging for a pre-test, or charging for a separate MOT."},
            {"heading": "Never miss a renewal",
             "body": "So that you don't miss your renewal dates, we will remind you when your vehicle is due its "
                     "MOT, service or any work we have advised in an earlier booking. With your permission, we "
                     "happily email, phone or write to you so that you are never likely to miss your vehicle's "
                     "most important dates."},
            {"heading": "Book early", "style": "tip",
             "body": "Don't forget your MOT can be done up to 30 days before it is due without losing any time on "
                     "your certificate, so book early to get the most convenient time for you."},
            {"heading": "Free retests", "style": "callout",
             "body": "So long as we do the repairs on site at our Beeston garage, we will not charge for your "
                     "retest."},
        ],
    },
    {
        "slug": "diagnostics", "title": "Diagnostics", "icon": "gauge",
        "headline": "Has a warning light appeared on your dashboard?",
        "summary": "Warning light on? Our staged diagnostics find the fault – and you stay in control of how far "
                   "we go.",
        "sections": [
            {"heading": "Stage 1 diagnostic",
             "body": "A warning light or fault code can be very worrying, especially if the engine light appears! "
                     "Here at Jim Steel's, we will carry out a Stage 1 Diagnostic to see what is at fault & advise "
                     "from there.\n\nWe will either clear the codes if we can & reset the light. If this cannot be "
                     "done, we will provide you with an estimate for the next stage of the repair process – "
                     "sometimes a \"Fix & Go\" repair."},
            {"heading": "What do we mean by Fix & Go?",
             "body": "This is where we have carried out a diagnostic and the system will not be reset. We are "
                     "guided by the diagnostic equipment to what may be at fault and what will need to be replaced "
                     "to complete the repair – or indeed whether there is another issue which will not identify "
                     "itself until the previous part is fitted and the system is retested. Hence, Fix & Go."},
            {"heading": "You're in control", "style": "callout",
             "body": "You, the customer, are in total control of how far the diagnostic stage goes. We keep you "
                     "informed at the end of each stage, and we will only do what you authorise us to do."},
            {"heading": "Car warning lights – red & amber", "image": "red-orange-lights.png",
             "image_alt": "Chart of red and amber car dashboard warning lights and what they mean",
             "body": "Red lights usually mean stop safely as soon as you can. Amber lights mean get it checked soon."},
            {"heading": "Car warning lights – green & blue", "image": "green-warning-lights.png",
             "image_alt": "Chart of green and blue car dashboard indicator lights and what they mean",
             "body": "Green and blue lights are information only – they tell you a system is switched on."},
        ],
    },
    {
        "slug": "electric-servicing", "title": "Electric & Hybrid", "icon": "zap",
        "headline": "Servicing for hybrid and electric vehicles",
        "summary": "Technicians trained on the latest hybrid and electric vehicle technology.",
        "sections": [
            {"heading": "Trained for the latest technology",
             "body": "All of our technicians are fully trained, and take part in ongoing training programmes, "
                     "allowing us to stay right up-to-date with the latest in car technology, including hybrid "
                     "(electric) vehicles.\n\nCall us or send an enquiry for service packages and options for your "
                     "electric or hybrid vehicle."},
        ],
    },
    {
        "slug": "air-conditioning", "title": "Air Conditioning", "icon": "snowflake", "price_from": "49.99",
        "headline": "Be the coolest person on the road",
        "summary": "Air con re-gas for both R134A and HFO-1234yf systems, plus anti-bacterial treatment and fault "
                   "diagnosis.",
        "packages": [
            {"name": "R134A Gas", "price": "49.99", "price_prefix": "",
             "description": "Most vehicles manufactured before 2014."},
            {"name": "HFO-1234yf Gas", "price": "130.00", "price_prefix": "",
             "description": "All vehicles with air conditioning manufactured since 1 January 2017, and some from "
                            "2014–2016."},
        ],
        "sections": [
            {"heading": "How do I know which air con gas I require?",
             "body": "R134A gas is common in vehicles manufactured before 2014. All vehicles with air conditioning "
                     "manufactured since 1st January 2017 include the new R1234YF air con gas, which is more "
                     "environmentally friendly. Since this date, manufacturers are no longer allowed to use the "
                     "older R134A gas in a bid to reduce global warming, as the old gas is believed to be more "
                     "damaging to the environment.\n\nR1234YF gas was phased in by vehicle manufacturers over time, "
                     "so vehicles rolling off the production line between 2014 and 2016 could require either gas. "
                     "Not sure? Give us a call with your registration and we'll tell you."},
            {"heading": "Did you know?", "style": "tip",
             "body": "Air conditioning doesn't just provide in-car comfort during the hot summer months; it can also "
                     "be used in winter to de-mist your windscreen. Air con systems create dry warm air rather than "
                     "the normal humid air from outside, which can clear your windscreen much faster."},
            {"heading": "All air-conditioning services",
             "bullets": "Anti-bacterial treatment\nVac and regassing\nClimate control systems\nFault diagnosis\n"
                        "Diagnostics for most makes and models"},
        ],
    },
    {
        "slug": "loyalty-bingo-card", "title": "Loyalty Bingo Card", "icon": "gift",
        "headline": "With every visit we stamp your card – once full, you win a prize!",
        "summary": "Collect a stamp with every visit. Fill the card and win a prize.",
        "sections": [
            {"heading": "Collect a stamp for each of the following",
             "bullets": "1 x Google review\n2 x Any mechanical repairs\n1 x Any bulb\n1 x MOT\n"
                        "1 x Air con regas or coolant change\n1 x Brake fluid change\n1 x Brake work\n"
                        "1 x Interim service\n1 x Full service\n1 x Wiper blade(s)\n1 x Free stamp – on us!"},
            {"heading": "Jim Steel's Loyalty Bingo Card", "image": "loyalty-bingo.png",
             "image_alt": "Jim Steel's Loyalty Bingo Card showing the stamps you can collect"},
        ],
    },
]

PROMOTIONS = [
    {"title": "MOTs", "price_label": "From only £48.00", "blurb": "Class 4 MOT with free retests.",
     "link": "/services/mot"},
    {"title": "Servicing", "price_label": "From £100.42", "blurb": "Manufacturer-spec servicing, warranty safe.",
     "link": "/services/servicing"},
    {"title": "Air Conditioning", "price_label": "Only £49.99", "blurb": "R134A re-gas & anti-bacterial clean.",
     "link": "/services/air-conditioning"},
    {"title": "Winter Check", "price_label": "£39.95 inc VAT", "blurb": "Stay winter safe.", "link": "/book"},
]

PAGES = {
    "home": {
        "title": "Home",
        "headline": "Car repairs, servicing and MOTs in Beeston",
        "intro": "Established in 1982, Jim Steel Garage is a friendly, family-run independent garage that has "
                 "been a staple of the local community for many years now. With an experienced team of experts "
                 "on hand, and a wide range of products and services available, our motto is simple.",
        "sections": [
            {"heading": "Fully trained, always learning",
             "body": "All of our technicians are fully trained, and take part in ongoing training programmes, "
                     "allowing us to stay right up-to-date with the latest in car technology, including hybrid "
                     "(electric) vehicles, and air-conditioning to the latest regulations.\n\nWe specialise in "
                     "light commercial vehicles up to four tonnes, including long wheelbase and high top Luton "
                     "vans. From Audi to Volvo, we'll give you the same standard of care as the main dealers."},
            {"heading": "We can service your car even if it is under warranty!", "style": "callout",
             "body": "We can service your car old or brand new. We use the standard manufacturer's spec and "
                     "original equipment parts, which means your warranty is unaffected. It's a common myth that "
                     "you must service your car at the main dealer or you will invalidate the warranty.\n\nWe are "
                     "local and simply better value, and the warranty remains unaffected. Why pay over £100 an hour "
                     "for labour, or even more?"},
        ],
    },
    "about": {
        "title": "About Us",
        "headline": "Three generations of the Steel family",
        "intro": "Jim Steel Garage is a friendly, family-run independent garage that has been a staple of the "
                 "local community for many years now.",
        "sections": [
            {"heading": "1982 – Where it started",
             "body": "Jim had been buying and selling cars on the premises for 12 years when the garage and "
                     "workshop became empty. Jim decided to expand his car sales to repairs as well, which is when "
                     "his elder son Kevin joined him after working in main dealer garages, gaining his experience "
                     "and knowledge in a wide variety of all makes and models of cars."},
            {"heading": "Moving to Station Road",
             "body": "After 18 months the business became so established it was decided to move to our present "
                     "premises on Station Road."},
            {"heading": "2008 – Kevin takes the wheel",
             "body": "In 2008 Jim retired from the business. With Kevin in full control, the business went from "
                     "strength to strength. Kevin served on the National Panel of the Unipart Car Care system for "
                     "5 years, representing the East Midlands.\n\nKevin is also involved with training the new "
                     "stars of today and is a member of the Motor Vehicle Trailblazer group, becoming Chairman in "
                     "2017."},
            {"heading": "2009 – The third generation",
             "body": "2009 was a major turning point in the business when the third generation of the Steels "
                     "arrived. Kevin's son Sam joined the business, becoming part owner in 2016."},
            {"heading": "Always investing",
             "body": "We pride ourselves on constantly growing as a garage, and striving to offer the best possible "
                     "services, continually investing in state-of-the-art diagnostics and quality equipment to be "
                     "able to service the latest cars. From Audi to Volvo, we'll give you the same standard of care "
                     "as the main dealers."},
            {"heading": "A Trust My Garage member", "style": "checklist",
             "body": "Over the last few years, the garage has continued to grow, and we can now proudly call "
                     "ourselves a Trust My Garage member, joining a national network of independent garages "
                     "offering:",
             "bullets": "First class service at affordable prices\n"
                        "A national network of garages servicing all makes and models\n"
                        "Bosch technicians trained on the latest technologies\n"
                        "Up-to-date diagnostic equipment to pinpoint faults quickly and accurately\n"
                        "Replacement parts of the same quality as the original, so your manufacturer's warranty "
                        "will not be affected\n"
                        "A real commitment to customer care – all Bosch Car Service garages work to a Bosch Car "
                        "Service Code of Practice"},
            {"heading": "Independent Garage Association Car Repair Plan", "style": "callout",
             "body": "Jim Steel Garage is also part of the Independent Garage Association Car Repair Plan, meaning "
                     "you can pay into a scheme rather than paying us directly, allowing you to better manage your "
                     "vehicle maintenance budget."},
            {"heading": "We offer", "style": "checklist",
             "bullets": "Free collection and delivery service\nBreakdown recovery service\n"
                        "Factory trained technicians\nManufacturer specification service and repair\n"
                        "12 months parts and labour warranty\nComplimentary courtesy vehicles"},
            {"heading": "Repairs, fault finding & diagnostics", "style": "checklist",
             "bullets": "Engine management\nRepairs & fault diagnosis\nMOTs & MOT repairs\n"
                        "Electrical fault checking & diagnostic work"},
        ],
    },
    "cookie-policy": {
        "title": "Cookie Policy",
        "headline": "How we use cookies",
        "sections": [
            {"body": "A cookie is a small file which asks permission to be placed on your computer's hard drive. "
                     "You agree to this by continuing to use our website, the file is added and the cookie helps "
                     "analyse web traffic or lets you know when you visit a particular site. Cookies allow web "
                     "applications to respond to you as an individual. The web application can tailor its "
                     "operations to your needs, likes and dislikes by gathering and remembering information about "
                     "your preferences.\n\nOverall, cookies help us provide you with a better website, by enabling "
                     "us to monitor which pages you find useful and which you do not. A cookie in no way gives us "
                     "access to your computer or any information about you, other than the data you choose to "
                     "share with us.\n\nYou can choose to accept or decline cookies. Most web browsers "
                     "automatically accept cookies, but you can usually modify your browser settings to decline "
                     "cookies if you prefer."},
            {"heading": "How can I control cookies?",
             "body": "If you don't want to receive cookies, you can modify your browser so that it notifies you "
                     "when cookies are sent to it or you can refuse cookies altogether. You can also delete cookies "
                     "that have already been set.\n\nIf you wish to restrict or block web browser cookies which "
                     "are set on your device then you can do this through your browser settings; the Help function "
                     "within your browser should tell you how."},
        ],
    },
}


class Command(BaseCommand):
    help = "Seed the database with content from the original Jim Steel Garages website."

    def add_arguments(self, parser):
        parser.add_argument("--reset", action="store_true", help="Delete existing content first")

    @transaction.atomic
    def handle(self, *args, reset=False, **opts):
        if reset:
            for model in (m.Service, m.Page, m.Promotion, m.Video, m.Accreditation, m.SiteSettings):
                model.objects.all().delete()
        elif m.Service.objects.exists():
            self.stdout.write(self.style.WARNING("Content already present – use --reset to reload."))
            return

        site = m.SiteSettings(
            business_name="Jim Steel Garage Services",
            tagline="Service, Repairs, MOTs, Fleet Maintenance, Bodywork – Beeston, Nottingham",
            motto="The answer is YES. How can we help you?",
            established_year=1982,
            phone="0115 922 7805",
            email="service@jimsteelgarages.co.uk",
            address_line1="135 Station Road",
            town="Beeston",
            county="Nottinghamshire",
            postcode="NG9 2AZ",
            opening_hours="Mon–Thu: 8am – 5:30pm\nFri: 8am – 5pm\nSat–Sun: Closed",
            latitude=Decimal("52.924510"),
            longitude=Decimal("-1.210939"),
            map_embed_url="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4810.657557740851!2d-1.2135188873910336"
                          "!3d52.924509872053825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4879e9db2a217dc7"
                          "%3A0xb65b05a1cb648aae!2sJim%20Steel%20Garage%20Services!5e0!3m2!1sen!2suk!4v1749141129801"
                          "!5m2!1sen!2suk",
            google_reviews_url="https://www.google.com/maps/place/Jim+Steel+Garage+Services/@52.9245099,-1.2109386,15z"
                               "/data=!4m8!3m7!1s0x4879e9db2a217dc7:0xb65b05a1cb648aae!8m2!3d52.9245099!4d-1.2109386"
                               "!9m1!1b1!16s/g/1tftwh1q",
            facebook_url="https://www.facebook.com/jimsteelgarage",
            x_url="https://x.com/jimsteelgarages",
            linkedin_url="https://www.linkedin.com/company/jim-steel-garages/",
            booking_url="https://jimsteel.wsptm.com",
            service_history_url="https://jimsteelgarages.portal.wsptm.com/",
        )
        attach(site, "logo", "header.png")
        attach(site, "icon", "js-icon.png")
        attach(site, "privacy_policy", "jim-steel-privacy-policy.pdf")
        site.save()

        for i, name in enumerate([
            ("Trust My Garage", "Member of the national network of trusted independent garages"),
            ("Class 4 MOT Station", "DVSA licensed MOT testing for cars and light vans"),
            ("IGA Car Repair Plan", "Spread the cost of maintenance with the Independent Garage Association"),
            ("Bosch-trained technicians", "Trained on the latest technologies"),
        ]):
            m.Accreditation.objects.create(name=name[0], description=name[1], order=i)

        for i, p in enumerate(PROMOTIONS):
            promo = m.Promotion(order=i, **p)
            if i == 0:
                attach(promo, "image", "workshop.jpg")
            promo.save()

        m.Video.objects.create(title="Welcome to Jim Steel Garage Services", youtube_id="QFKg2cna4Xg",
                               placement="home", order=0)
        m.Video.objects.create(title="Trust My Garage", youtube_id="8oZk0y7SsLw", placement="about", order=1)

        for i, data in enumerate(SERVICES):
            data = dict(data)
            packages = data.pop("packages", [])
            sections = data.pop("sections", [])
            price = data.pop("price_from", None)
            svc = m.Service.objects.create(order=i, price_from=Decimal(price) if price else None, **data)
            for j, pk in enumerate(packages):
                m.PricePackage.objects.create(service=svc, order=j, **{**pk, "price": Decimal(pk["price"])})
            for j, sec in enumerate(sections):
                sec = dict(sec)
                image = sec.pop("image", None)
                section = m.ServiceSection(service=svc, order=j, **sec)
                if image:
                    attach(section, "image", image)
                section.save()

        for slug, data in PAGES.items():
            data = dict(data)
            sections = data.pop("sections", [])
            page = m.Page.objects.create(slug=slug, **data)
            for j, sec in enumerate(sections):
                m.PageSection.objects.create(page=page, order=j, **sec)

        self.stdout.write(self.style.SUCCESS(
            f"Seeded {m.Service.objects.count()} services, {m.Page.objects.count()} pages, "
            f"{m.Promotion.objects.count()} promotions, {m.Video.objects.count()} videos."))
