import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGetNoteById, apiGetMCQsByNoteId, apiGenerateAndGetMCQsForNote } from '../services/api';
import MCQViewer from '../components/MCQViewer';
import { FiLoader, FiArrowLeft, FiAlertCircle, FiZap, FiHelpCircle } from 'react-icons/fi';

function MCQsPage() {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [noteResponse, mcqsResponse] = await Promise.all([
        apiGetNoteById(noteId),
        apiGetMCQsByNoteId(noteId),
      ]);
      setNote(noteResponse.note);
      setMcqs(mcqsResponse.mcqs || []);
    } catch (err) {
      console.error('Failed to load data:', err);
      // Don't show an error if MCQs are not found, just an empty state.
      if (!err.message.includes('not found')) {
        setError(err.message || 'Failed to load MCQs and note details.');
      }
    } finally {
      setLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGenerateMCQs = async () => {
    try {
      setGenerating(true);
      setError('');
      const mcqsResponse = await apiGenerateAndGetMCQsForNote(noteId);
      setMcqs(mcqsResponse.mcqs || []);
    } catch (err) {
      console.error('Failed to generate MCQs:', err);
      setError(err.message || 'Failed to generate MCQs.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading && !generating) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        <FiLoader className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700">
            <FiHelpCircle className="h-3.5 w-3.5" />
            MCQs
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {note?.originalFileName || 'Multiple Choice Questions'}
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Test your knowledge with these automatically generated questions.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700">
            <FiAlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {generating && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
                <FiLoader className="h-10 w-10 animate-spin text-indigo-600" />
                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                    Generating MCQs...
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                    This may take a moment. Please wait.
                </p>
            </div>
        )}


        {!loading && !generating && mcqs.length > 0 ? (
          <MCQViewer mcqs={mcqs} />
        ) : (
          !generating && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
              <h3 className="text-lg font-semibold text-slate-800">
                No MCQs Found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Generate a set of MCQs from this note's content.
              </p>
              <button
                onClick={handleGenerateMCQs}
                disabled={generating}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {generating ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FiZap className="h-4 w-4" />
                    Generate MCQs
                  </>
                )}
              </button>
            </div>
          )
        )}

        <div className="text-center">
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
          >
            <FiArrowLeft />
            Back to Notes Library
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MCQsPage;
