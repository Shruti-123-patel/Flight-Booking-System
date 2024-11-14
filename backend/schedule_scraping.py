import schedule

schedule.every().day.at("09:00").do(scrape_with_selenium)

while True:
    schedule.run_pending()
    time.sleep(60)
