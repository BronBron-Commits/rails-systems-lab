class Api::NotesController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    notes = Note.includes(:user, :comments).all
    render json: notes.map { |note| serialize_note(note) }
  end

  def show
    note = Note.includes(:user, :comments).find(params[:id])
    render json: serialize_note(note)
  end

  def create
    note = Note.new(note_params)

    if note.save
      render json: serialize_note(note), status: :created
    else
      render json: { errors: note.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    note = Note.find(params[:id])

    if note.update(note_params)
      render json: serialize_note(note)
    else
      render json: { errors: note.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    note = Note.find(params[:id])
    note.destroy
    head :no_content
  end

  private

  def note_params
    params.require(:note).permit(
      :title,
      :body,
      :status,
      :user_id,
      :machine_name,
      :machine_location,
      :machine_model,
      :operating_hours
    )
  end

  def serialize_note(note)
    {
      id: note.id,
      title: note.title,
      body: note.body,
      status: note.status,
      score: note.score,
      machine_name: note.machine_name,
      machine_location: note.machine_location,
      machine_model: note.machine_model,
      operating_hours: note.operating_hours,
      user: note.user ? {
        id: note.user.id,
        name: note.user.name
      } : nil,
      comments: note.comments.map do |comment|
        {
          id: comment.id,
          body: comment.body
        }
      end
    }
  end
end
