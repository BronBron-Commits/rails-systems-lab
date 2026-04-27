namespace :fleet do
  desc "Generate realistic Caterpillar-style machine fault work orders"
  task generate_faults: :environment do
    models = [
      ["Excavator", "Cat 320"],
      ["Excavator", "Cat 336"],
      ["Excavator", "Cat 340"],
      ["Excavator", "Cat 349"],
      ["Dozer", "Cat D6"],
      ["Dozer", "Cat D8"],
      ["Wheel Loader", "Cat 966M"],
      ["Wheel Loader", "Cat 980"],
      ["Articulated Truck", "Cat 745"],
      ["Motor Grader", "Cat 140"],
      ["Mining Truck", "Cat 797F"]
    ]

    sites = [
      "North Quarry",
      "Site A",
      "Downtown Excavation",
      "Aggregate Yard",
      "Highway Expansion Zone",
      "West Pit",
      "Depot Bay 3"
    ]

    faults = [
      ["Hydraulic pressure warning", "urgent inspection required, hydraulic pressure dropped below expected range"],
      ["Engine temperature high", "urgent fault detected, engine temperature exceeded normal operating band"],
      ["Low fuel pressure", "fuel delivery irregularity detected under load"],
      ["Track tension issue", "track tension outside service range, inspect undercarriage"],
      ["Brake system warning", "urgent brake warning reported during operation"],
      ["Bucket control delay", "operator reported delayed hydraulic response at bucket controls"],
      ["Transmission fault code", "powertrain fault code logged during shift"],
      ["Oil leak detected", "fluid visible near lower engine compartment"],
      ["Sensor communication loss", "machine telemetry reported intermittent sensor dropout"],
      ["Scheduled service due", "operating hours threshold reached for planned maintenance"]
    ]

    count = ENV.fetch("COUNT", "50").to_i

    count.times do |i|
      type, model = models.sample
      fault_title, fault_body = faults.sample
      machine_number = rand(100..999)

      Note.create!(
        title: "#{fault_title} - #{model}",
        body: fault_body,
        status: ["Open", "In Progress", "Completed"].sample,
        machine_name: "#{type} #{machine_number}",
        machine_model: model,
        machine_location: sites.sample,
        operating_hours: rand(250..12_500)
      )
    end

    puts "Generated #{count} fleet fault work orders."
  end
end
