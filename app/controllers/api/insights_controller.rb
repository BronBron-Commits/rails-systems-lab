class Api::InsightsController < ApplicationController
  def index
    notes = Note.all

    render json: {
      totals: {
        total: notes.count,
        open: notes.where.not(status: "Completed").count,
        completed: notes.where(status: "Completed").count,
        high_priority: notes.where("score >= 30").count
      },
      breakdowns: {
        by_model: notes.group(:machine_model).count,
        by_location: notes.group(:machine_location).count,
        by_status: notes.group(:status).count
      }
    }
  end
end
