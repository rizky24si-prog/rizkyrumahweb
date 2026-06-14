import React from 'react';
import { Star, MessageCircle, Phone, CheckCircle } from 'lucide-react';

const PendingReviews = ({ reviews = [], onFollowUp, onMarkDone }) => {
  const badReviews = reviews.filter(r => r.rating_comfort <= 3);

  if (badReviews.length === 0) {
    return (
      <div className="card bg-green-50 border-green-200">
        <div className="p-4 flex items-center gap-3">
          <CheckCircle size={24} className="text-green-500" />
          <div>
            <p className="font-semibold text-green-700">Tidak Ada Keluhan</p>
            <p className="text-sm text-green-600">Semua pasien puas dengan pelayanan</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-txt-primary flex items-center gap-2">
          <Star size={18} className="text-red-500" />
          Keluhan Pasien ({badReviews.length})
        </h2>
        <p className="text-sm text-gray-500 mt-1">Rating &lt; 3 perlu follow-up</p>
      </div>
      <div className="divide-y divide-gray-100">
        {badReviews.map((review) => (
          <div key={review.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-900">{review.patient_name}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star 
                      key={star} 
                      size={14} 
                      className={star <= review.rating_comfort ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2 max-w-md">{review.comments}</p>
                <p className="text-xs text-gray-400 mt-1">drg. {review.doctor_name} • {review.treatment_name}</p>
              </div>
              <div className="flex gap-2">
                {review.follow_up_status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => onFollowUp && onFollowUp(review.id)}
                      className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
                    >
                      <Phone size={16} />
                    </button>
                    <button 
                      onClick={() => onMarkDone && onMarkDone(review.id)}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                    >
                      <CheckCircle size={16} />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Sudah Ditindaklanjuti
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingReviews;
