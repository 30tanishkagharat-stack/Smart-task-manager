import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface MotivationalPopupProps {
  open: boolean;
  onClose: () => void;
  message: string;
  points: number;
}

export function MotivationalPopup({ open, onClose, message, points }: MotivationalPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm text-center border-0 shadow-glow">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: 2, duration: 0.5 }}
                className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4"
              >
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <h3 className="text-xl font-display font-bold mb-2">Task Completed!</h3>
              <p className="text-muted-foreground mb-3">{message}</p>
              <p className="text-2xl font-display font-bold text-gradient">+{points} points</p>
              <Button onClick={onClose} className="mt-4 gradient-primary border-0">Continue</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
